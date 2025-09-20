const V1 = {
    APP_ROUTE: [
        require("./v1/app/router/auth"),
        require("./v1/app/router/violationEvent"),
    ],
    ADMIN_ROUTE: [
        require("./v1/Admin/router/admin.lookup"),
        require("./v1/Admin/router/admin.healthProfiling"),
        require("./v1/Admin/router/admin.stationMaster"),
        require("./v1/Admin/router/admin.routes"),
        require("./v1/Admin/router/admin.asset"),
        require("./v1/Admin/router/admin.login"),
        require("./v1/Admin/router/admin.dash"),
        require("./v1/Admin/router/admin.duty"),
    ],
    COMMON_ROUTE: [
        require("./v1/Common/router/lookup"),
        require("./v1/Common/router/imageUpload"),
    ],
};
module.exports = { V1 };
