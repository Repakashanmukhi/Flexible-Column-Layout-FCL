sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller,MessageToast) => {
    "use strict";
    var that;
    return Controller.extend("fcl.controller.View1", {
        onInit() {
            that=this;
            that.oEventBus = that.getOwnerComponent().getEventBus();
        },
        onNav: function(oEvent){
            var oItem = oEvent.getSource().getBindingContext().getProperty("ID");
            that.oEventBus.publish("flexible","setView2",{
                ID: oItem
            });
        },
        formatJoiningDate: function (sDate) {
            if (sDate) {
                var oDate = new Date(sDate);
                var oFormatter = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
                return oFormatter.format(oDate);
            }
        },
        handleUpload: function()
        {
            if (!that.upload) 
                {
                    that.upload = sap.ui.xmlfragment("fcl.fragments.Upload", that);
                    that.getView().addDependent(that.upload);
                }
                that.upload.open();
        }, 
        onFileChange: function(oEvent) 
        {
            var aFile = oEvent.getParameter("files");
            if (aFile.length > 0) 
            {
                var oFile = aFile[0];
                var reader = new FileReader();
                reader.onload = function(e) 
                {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { 
                        type: 'array'
                     });
                    var sheetNames = workbook.SheetNames;
                    var sheet = workbook.Sheets[sheetNames[0]];
                    var jsonData = XLSX.utils.sheet_to_json(sheet);
                    console.log(jsonData);
                    that.selectedFile = oFile;  
                    that.jsonData = jsonData;
                } 
                reader.readAsArrayBuffer(oFile);
            }
        },     
        ExcelUpload: function () {
            var oData = that.jsonData;
            var oModel = that.getOwnerComponent().getModel();
            oData.forEach(entry => {
                var joiningdate = entry.JoiningDate;
                joiningdate = new Date((joiningdate - 25569) * 86400 * 1000);
                var year = joiningdate.getFullYear();
                var month = ("0" + (joiningdate.getMonth() + 1)).slice(-2);
                var day = ("0" + joiningdate.getDate()).slice(-2);
                var formattedJoiningDate = `${year}-${month}-${day}`;
                var aFilters = [
                    new sap.ui.model.Filter({
                        path: 'FirstName',  
                        operator: sap.ui.model.FilterOperator.EQ, 
                        value1: entry.FirstName 
                    }),
                ];
                oModel.read("/EmployeeInfo", {
                    filters: aFilters,
                    success: function (response) {
                        if (response.results && response.results.length > 0) {
                            var existingRecord = response.results[0]; 
                            console.log("Duplicate entries found in EmployeeInfo ", entry);
                            // Create Employee Entry to update
                            var oEmployeeEntry = {
                                ID: existingRecord.ID,
                                FirstName: entry.FirstName,
                                LastName: entry.LastName,
                                Email: entry.Email,
                                Phone: entry.Phone + "",
                                BloodGroup: entry.BloodGroup,
                                Department: entry.Department,
                                Position: entry.Position,
                                Salary: entry.Salary + "",
                                JoiningDate: formattedJoiningDate 
                            };
                            oModel.update("/EmployeeInfo(" + existingRecord.ID + ")", oEmployeeEntry, {
                                success: function (response) {
                                    MessageToast.show("Employee record updated successfully");
                                    handleEmergencyContact(entry, existingRecord.ID);
                                },
                                error: function (error) {
                                    console.log("Employee update failed:", error);
                                }
                            });
                            oModel.create("/EmployeeInfo", oEmployeeEntry, {
                                success: function (response) {
                                    console.log("Employee upload successful: ", response);
                                    var newEmployeeID = response.ID;
                                    handleEmergencyContact(entry, newEmployeeID);
                                },
                                error: function (error) {
                                    console.log("Employee upload failed: ", error);
                                }
                            });
                        }
                    },
                });
                function handleEmergencyContact(entry, EmployeeID) {
                    var oEmergency = {
                        EmployeeID:   entry.EmployeeID,
                        ContactName:  entry.ContactName, 
                        Relationship: entry.Relationship,
                        ContactPhone: entry.ContactPhone + "", 
                        ContactEmail: entry.ContactEmail
                    };
                    var aContactFilters = [
                        new sap.ui.model.Filter({
                            path: 'EmployeeID', 
                            operator: sap.ui.model.FilterOperator.EQ, 
                            value1: EmployeeID
                        }),
                    ];
                    oModel.read("/EmployeeInfoEmergencyContact", {
                        filters: aContactFilters,
                        success: function (response) {
                            if (response.results && response.results.length > 0) {
                                var existingContact = response.results[0];
                                console.log("Duplicate entries found in EmergencyContact: ", entry);
                                oModel.update("/EmployeeInfoEmergencyContact(" + existingContact.ID + ")", oEmergency, {
                                    success: function (response) {
                                        console.log("Emergency contact updated successfully");
                                    },
                                    error: function (error) {
                                        console.log("Emergency contact update failed:", error);
                                    }
                                });
                            } else {
                                var oEmergencyContactEntry = {
                                    EmployeeID:   entry.EmployeeID,
                                    ContactName:  entry.ContactName, 
                                    Relationship: entry.Relationship,
                                    ContactPhone: entry.ContactPhone + "", 
                                    ContactEmail: entry.ContactEmail
                                };
                                oModel.create("/EmployeeInfoEmergencyContact", oEmergencyContactEntry, {
                                    success: function (response) {
                                        console.log("Emergency contact uploaded successfully");
                                    },
                                    error: function (error) {
                                        console.log("Emergency contact upload failed: ", error);
                                    }
                                });
                            }
                        },
                    });
                }
            });
        },
        close: function() 
        {   
        that.upload.close();
        }
    });
});

