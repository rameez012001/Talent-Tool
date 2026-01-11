sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
    "use strict"
    return Controller.extend("talentoolui.controller.Users", {
        onInit() {
            this.getView().setModel(this.getOwnerComponent().getModel(), "Users");
        },
        onUserItemPressed: function (oEvent) {
            const oItem = oEvent.getSource();
            const oCtx = oItem.getBindingContext();
            const sId = oCtx.getProperty("ID");
            this.getOwnerComponent()
                .getRouter()
                .navTo("RouteUserObject", { id: sId });

        },
        onCreateBtnPressed: function () {
            if (!this._oAssignDialog) {
                this._oAssignDialog = sap.ui.xmlfragment(
                    this.getView().getId(),
                    "talentoolui.view.fragments.CreateUser",
                    this
                );
                this.getView().addDependent(this._oAssignDialog);
            }

            this._oAssignDialog.open();

        },

        onCreateUser: function () {
            const oView = this.getView();
            const oModel = this.getOwnerComponent().getModel();

            const oListBinding = oModel.bindList("/Users");

            oListBinding.create({
                userId: oView.byId("userId").getValue(),
                name: oView.byId("userName").getValue(),
                email: oView.byId("userEmail").getValue(),
                department: oView.byId("userDept").getSelectedKey()
            }).created().then(() => {
                sap.m.MessageToast.show("User created successfully");
                this._oAssignDialog.close();
            }).catch(() => {
                sap.m.MessageToast.show("Error");
            });
        },
        onCloseDialog: function () {
            this._oAssignDialog.close();
        }

    })
});