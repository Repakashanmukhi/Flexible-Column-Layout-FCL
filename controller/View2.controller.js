sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    return Controller.extend("fcl.controller.View2", {
        onInit() {
            this.oEventBus = this.getOwnerComponent().getEventBus();
            this.oEventBus.subscribe("flexible", "setView2", this.onFirstRender, this);
            this.isFirstRender = true; // Flag to track first render
        },
        // data: function(schannel, sEventId, oData){
        //     var oId = oData;
        // },
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
    });
});
    
        // To create EmployeeInfoEmergencyContact records
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
//     });
// });