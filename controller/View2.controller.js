sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    var that;
    return Controller.extend("fcl.controller.View2", {
        onInit() {
            that=this;
            that.oEventBus = that.getOwnerComponent().getEventBus();
        },
        onClose: function(){
            this.oEventBus.publish("flexible","setView1");
        }
        //To create EmployeeInfoEmergencyContact records
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
        // DeleteBtn: function(oEvent)
        // {
        //     var oButton=oEvent.getSource();
        //     // Bringing the binding context of the button.
        //     var oContext=oButton.getBindingContext();
        //     // Get the path of the context (Location).
        //     var sPath=oContext.getPath();
        //     var oModel=that.getView().getModel();
        //     // Syntax to Delete the record in oData Serivice.
        //     oModel.remove(sPath,{
        //         success: function()
        //         {
        //             sap.m.MessageToast.show("Record deleted successfully!");
        //         },
        //         error: function()
        //         {
        //             sap.m.MessageToast.show("Cannot delete record");
        //         }
        //     }) 
        // },  
        // OnClose: function()
        // {
        //     that.Personalinfo.close()
        // }
    });
});