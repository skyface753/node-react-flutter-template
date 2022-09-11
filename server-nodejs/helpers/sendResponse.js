let sendResponse = {
  success: (res, data) => {
    res.status(200).json({
      success: true,
      data: data,
    });
  },
  missingParams: (res, data) => {
    res.status(400).json({
      success: false,
      message: "Missing Parameters",
      data: data,
    });
  },
  error: (res, data) => {
    res.status(400).json({
      success: false,
      message: "Error",
      data: data,
    });
  },
  authError: (res, data) => {
    res.status(401).json({
      success: false,
      message: "Authentication Error",
      data: data,
    });
  },
  authAdminError: (res, data) => {
    res.status(403).json({
      success: false,
      message: "Admin Authentication Error",
      data: data,
    });
  },
  serverError: (res, data) => {
    res.status(500).json({
      success: false,
      message: "Server Error",
      data: data,
    });
  },
};

module.exports = sendResponse;
