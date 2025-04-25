sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller,Filter,FilterOperator) => {
    "use strict";
    var that;
    return Controller.extend("fcl.controller.View2", {
        onInit() {
            that = this;
            this.oEventBus = this.getOwnerComponent().getEventBus();
        },
        onClose: function(){
            this.oEventBus.publish("flexible", "setView1");
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
         onOpenDialog: function()
        {
            if(!this.Personalinfo)
            {
                this.Personalinfo = sap.ui.xmlfragment("fcl.fragments.Personal Info", this);
                this.getView().addDependent(this.Personalinfo);
            }
            this.Personalinfo.open();
        },
        onSubmit: function(){
            let oEmg = {
                EmployeeID :sap.ui.getCore().byId("eEmployee_Id").getValue(),
                ContactName :sap.ui.getCore().byId("eContactName").getValue(),
                Relationship :sap.ui.getCore().byId("eRelationship").getValue(),
                ContactPhone :sap.ui.getCore().byId("eContactPhone").getValue(),
                ContactEmail: sap.ui.getCore().byId("eContactEmail").getValue()            
            }
            var oModel = this.getOwnerComponent().getModel();
            oModel.create("/EmployeeInfoEmergencyContact",oEmg,{
                success:function(response){
                    sap.m.MessageToast.show("successfull");
                    oModel.refresh();
                },error:function(error){
                    sap.m.MessageToast.show("Error");
                    console.log(error);
                }
            })
            this.Personalinfo.close();
        },
        OnClose: function()
        {
            this.Personalinfo.close()
        },
    });
});  
       