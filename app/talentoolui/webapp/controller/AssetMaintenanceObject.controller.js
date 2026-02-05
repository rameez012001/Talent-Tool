sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel'], (Controller, JSONModel) => {
    "use strict";
    return Controller.extend('talentoolui.controller.AssetMaintenanceObject', {
        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("RouteAssetMaintenanceObject")
                .attachPatternMatched(this._onMatched, this);

        },

        _onMatched: function (oEvent) {
            const sId = oEvent.getParameter("arguments").id;

            this.getView().bindElement({
                path: `/MaintenanceRequests('${sId}')`,
                parameters: {
                    $expand: "technician,asset($expand=owner)",
                },
                events: {
                    dataReceived: this._onAssetLoaded.bind(this)
                },
            });
        },
        _onAssetLoaded: function () {
            let oContext = this.getView().getBindingContext();
            let sStatus = oContext.getProperty("status");
            let sTechnician = oContext.getProperty("technician/ID");
            if (sStatus == "FIXED") {
                this.byId('fixedBtn').setEnabled(false)
            }
            if (sTechnician) {
                this.byId('assignBtn').setEnabled(false)
            }
        },

        openUserDialog: function () {
            if (!this._oAssignDialog) {
                this._oAssignDialog = sap.ui.xmlfragment(
                    this.getView().getId(),
                    "talentoolui.view.fragments.AssignUserDialog",
                    this
                );
                this.getView().addDependent(this._oAssignDialog);
            }
            const oAssignUserModel = new JSONModel({
                title: "Assign Technician"
            })
            this._oAssignDialog.setModel(oAssignUserModel, "assignUser")

            this._oAssignDialog.open();
        },

        handleAssignConfirm: function () {
            let sTechnicianID = this.byId("assignUserSelect").getSelectedKey();

            if (!sTechnicianID) {
                sap.m.MessageToast.show("Please select a technician");
                return;
            }

            let oView = this.getView();
            let oModel = oView.getModel();
            let oContext = oView.getBindingContext();


            oContext.setProperty("technician_ID", sTechnicianID);
            oContext.setProperty("status", "INPROGRESS");


            oModel.submitBatch("auto").then(function () {
                sap.m.MessageToast.show("Technician assigned");
            }).catch(function () {
                sap.m.MessageToast.show("Assignment failed");
            });
            this._oAssignDialog.close();
            oModel.refresh(true);
        },

        onCloseDialog: function () {
            this._oAssignDialog.close();
        },

        onFixed: function () {
            const oView = this.getView();
            const oModel = oView.getModel();
            const oMRContext = oView.getBindingContext();

            // Maintenance Request Model
            const sStatus = oMRContext.getProperty("status");
            const sTechnicianId = oMRContext.getProperty("technician/ID");
            const sAssetId = oMRContext.getProperty("asset/ID");
            const ownerId = oMRContext.getProperty("asset/owner/ID");

            if (!sTechnicianId || sStatus !== "INPROGRESS") {
                sap.m.MessageToast.show("Assign a technician before fixing the request");
                return;
            }

            const sAssetStatus = ownerId ? "IN_USE" : "AVAILABLE";

            const oAssetBinding = oModel.bindContext(`/Assets('${sAssetId}')`, null, {
                $$updateGroupId: "auto"
            });

            // ✅ Request the context first
            oAssetBinding.requestObject()
                .then(() => {
                    const oAssetContext = oAssetBinding.getBoundContext();

                    oMRContext.setProperty("status", "FIXED");

                    oAssetContext.setProperty("status", sAssetStatus);
                    oAssetContext.setProperty("returnedOn", null);
                    oAssetContext.setProperty(
                        "assignedOn",
                        new sap.ui.model.odata.type.Date().parseValue(
                            new Date(),
                            "object"
                        )
                    );

                    return oModel.submitBatch("auto");
                })
                .then(() => {
                    sap.m.MessageToast.show("Maintenance request marked as FIXED");
                    oAssetBinding.destroy();
                })
                .catch((oError) => {
                    console.error("Update failed:", oError);
                    sap.m.MessageToast.show("Failed to update status");
                    oAssetBinding.destroy();
                });
        },

        reqPriorityState: function (state) {
            switch (state.toUpperCase()) {
                case "HIGH":
                    return "Error";
                case "MID":
                    return "Warning";
                case "LOW":
                    return "Information";
                default:
                    return "Success";
            }
        },
        reqStatusState: function (sStatus) {
            switch (sStatus.toUpperCase()) {
                case "OPEN":
                    return "Error";
                case "INPROGRESS":
                    return "Warning";
                case "FIXED":
                    return "Success";
                default:
                    return "None";
            }
        },

    })
})