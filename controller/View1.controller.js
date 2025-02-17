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
        onNav: function(){
            that.oEventBus.publish("flexible","setView2");
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
                    // Get the result from the FileReader.
                    var data = e.target.result;
                    // XLSX.read- Reads the file as an EXCEL workbook
                    var workbook = XLSX.read(data, { 
                        type: 'array'
                     });
                     // Get the sheet names from the workbook
                    var sheetNames = workbook.SheetNames;
                    // Select the first sheet in the workbook
                    var sheet = workbook.Sheets[sheetNames[0]];
                      //XLSX.utils.sheet_to_json- it Convert the sheet content into a JSON array of objects.
                    var jsonData = XLSX.utils.sheet_to_json(sheet);
                    console.log(jsonData);
                    // Store the file for use in ExcelUpload
                    that.selectedFile = oFile;  
                    that.jsonData = jsonData;
                } 
                //readAsArrayBuffer()- starts reading the content of specific file 
                reader.readAsArrayBuffer(oFile);
            }
        },     
        ExcelUpload: function () {
            // Get the data from onFileChange(jsonData)
            var oData = that.jsonData;
            var oMaster = that.getOwnerComponent().getModel();
            var oDetail= that.getOwnerComponent().getModel();
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
                oMaster.read("/EmployeeInfo", {
                    filters: aFilters,
                    success: function (response) {
                        if (response.results && response.results.length > 0) {
                            var existingRecord = response.results[0]; 
                            console.log("Duplicate entries found ", entry);
                            var oEntry = {
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
                            oMaster.update("/EmployeeInfo(" + existingRecord.ID+ ")", oEntry, {
                                success: function (response) {
                                    MessageToast.show("Record updated successfully");
                                },
                                error: function (error) {
                                    console.log("Update failed:", error);
                                }
                            });
                        } 
                        else {
                            var oEntry = {
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
                            oMaster.create("/EmployeeInfo", oEntry, {
                                success: function (response) {
                                    console.log("Upload successful: ", response);
                                    that.close();
                                },
                                error: function (error) {
                                    console.log("Upload failed: ", error);
                                }
                            });
                        }
                    }, 
                });
            });
        },
        close: function() 
        {   
        that.upload.close();
        }
    });
});