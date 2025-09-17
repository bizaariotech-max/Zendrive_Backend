const V1 = {
    APP_ROUTE: [
        require("./v1/app/router/auth"),
        require("./v1/app/router/violationEvent"),
    ],
    ADMIN_ROUTE: [
        require("./v1/Admin/router/admin.lookup"),
        require("./v1/Admin/router/admin.healthProfiling"),
        require("./v1/Admin/router/admin.stationMaster"),
    ],
    COMMON_ROUTE: [
        require("./v1/Common/router/lookup"),
        require("./v1/Common/router/imageUpload"),
    ],
};
module.exports = { V1 };
