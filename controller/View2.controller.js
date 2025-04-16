sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    return Controller.extend("fcl.controller.View2", {
        onInit() {
            this.oEventBus = this.getOwnerComponent().getEventBus();
            this.oEventBus.subscribe("flexible", "setView2", this.onFirstRender, this);
            this.isFirstRender = true; 
        },
       
        onClose: function(){
            this.oEventBus.publish("flexible", "setView1");
        },
        onAfterRendering: function() {
            if (this.isFirstRender) {
                this.isFirstRender = false; 
                this.onFirstRender(); 
            }
        },
        onFirstRender: function(schannel,sEventId,oData) {
            console.log("This is the first render!");
            var oId=oData;
            var oDetail= this.getOwnerComponent().getModel();
            oDetail.read("/EmployeeInfoEmergencyContact", {
                success:function(response){
                var filteredData = response.results.filter(emp => emp.ID === oId)
                }
            })
        },
        DeleteBtn: function(oEvent)
        {
            var oButton=oEvent.getSource();
            var oContext=oButton.getBindingContext();
            var sPath=oContext.getPath();
            var oModel=this.getView().getModel();
            oModel.remove(sPath,{
               success: function()
                {
                    sap.m.MessageToast.show("Record deleted successfully!");
                },
                error: function()
                {
                    sap.m.MessageToast.show("Cannot delete record");
                }
            }) 
        }, 
                                                                        // To update the Employee Emergency data
        // UpdateBtn: function(oEvent)
        // {
        //     if(!this.update)
        //     {
        //         this.update=sap.ui.xmlfragment("fcl.fragments.Update", this)
        //     }
        //     this.update.open();
        //     var oContext = oEvent.getSource().getBindingContext().getObject(); 
        //     sap.ui.getCore().byId("ContactName_E").setValue(oContext.ContactName);
        //     sap.ui.getCore().byId("Email_E").setValue(oContext.ContactEmail);
        //     sap.ui.getCore().byId("Phone_E").setValue(oContext.ContactPhone);
        //     sap.ui.getCore().byId("Relationship_E").setValue(oContext.Relationship);
        //     this.update.open();
        // },
        // onUpdateDialog: function()
        // {
        //     var sName = sap.ui.getCore().byId("ContactName_E").getValue();
        //     var sMail = sap.ui.getCore().byId("Email_E").getValue();
        //     var sPhone = sap.ui.getCore().byId("Phone_E").getValue();
        //     var sRelationship = sap.ui.getCore().byId("Relationship_E").getValue();
        //         var oUpdatedEmployee = {
        //             ContactName:sName,
        //             ContactEmail: sMail,
        //             ContactPhone: sPhone,
        //             Relationship: sRelationship
        //         };
        //         var oData = this.getOwnerComponent().getModel();
        //         var updatePath = `/EmployeeInfoEmergencyContact('${sName}')`
        //         oData.update(updatePath, oUpdatedEmployee,{
        //             success: function()
        //             {
        //             },
        //         error: function (error) 
        //         {
                
        //         }   
        //    })
        //    this.update.close()
        // },
        // onCancleDialog: function()
        // { 
        //     this.update.close()
        // },
        // UpdateBtn: function(oEvent) {
        //     if (!this.update) {
        //         this.update = sap.ui.xmlfragment("fcl.fragments.Update", this);
        //     }
            
        //     var oContext = oEvent.getSource().getBindingContext().getObject(); 
            
        //     // Save the ID to use during update
        //     this._currentContactId = oContext.ID;
        
        //     sap.ui.getCore().byId("ContactName_E").setValue(oContext.ContactName);
        //     sap.ui.getCore().byId("Email_E").setValue(oContext.ContactEmail);
        //     sap.ui.getCore().byId("Phone_E").setValue(oContext.ContactPhone);
        //     sap.ui.getCore().byId("Relationship_E").setValue(oContext.Relationship);
            
        //     this.update.open();
        // },
        
        // onUpdateDialog: function() {
        //     var sName = sap.ui.getCore().byId("ContactName_E").getValue();
        //     var sMail = sap.ui.getCore().byId("Email_E").getValue();
        //     var sPhone = sap.ui.getCore().byId("Phone_E").getValue();
        //     var sRelationship = sap.ui.getCore().byId("Relationship_E").getValue();
        
        //     var oUpdatedEmployee = {
        //         ContactName: sName,
        //         ContactEmail: sMail,
        //         ContactPhone: sPhone,
        //         Relationship: sRelationship
        //     };
        
        //     var oData = this.getOwnerComponent().getModel();
        //     var updatePath = `/EmployeeInfoEmergencyContact(guid'${this._currentContactId}')`;
        //     oData.update(updatePath, oUpdatedEmployee, {
        //         success: function() {
        //             sap.m.MessageToast.show("Update successful!");
        //         },
        //         error: function(error) {
        //             sap.m.MessageBox.error("Update failed: " + error.message);
        //         }
        //     });
        
        //     this.update.close();
        // },
        
        // onCancleDialog: function() {
        //     this.update.close();
        // }
        
    });
}); 
    
                                                                     // To create the Employee Emergency data
        // onOpenDialog: function()
        // {
        //     if(!that.Personalinfo)
        //     {
        //         that.Personalinfo = sap.ui.xmlfragment("fcl.fragments.Personal Info", that);
        //         that.getView().addDependent(that.Personalinfo);
        //     }
        //     that.Personalinfo.open();
        // },
        // onSubmit: function(){
        //     let oEmg = {
        //         EmployeeID :sap.ui.getCore().byId("eEmployee_Id").getValue(),
        //         ContactName :sap.ui.getCore().byId("eContactName").getValue(),
        //         Relationship :sap.ui.getCore().byId("eRelationship").getValue(),
        //         ContactPhone :sap.ui.getCore().byId("eContactPhone").getValue(),
        //         ContactEmail: sap.ui.getCore().byId("eContactEmail").getValue()            
        //     }
        //     var oModel = that.getOwnerComponent().getModel();
        //     oModel.create("/EmployeeInfoEmergencyContact",oEmg,{
        //         success:function(response){

        //             sap.m.MessageToast.show("successfull");
        //             oModel.refresh();
        //         },error:function(error){
        //             sap.m.MessageToast.show("Error");
        //             console.log(error);
        //         }
        //     })
        //     that.Personalinfo.close();
        // },
     
        // OnClose: function()
        // {
        //     that.Personalinfo.close()
        // }
        // });
        // });
        
