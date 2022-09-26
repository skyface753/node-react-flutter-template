/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';

const sendResponse = {
  success: (res: Response, data: any) => {
    res.status(200).json({
      success: true,
      data: data,
    });
  },
  missingParams: (res: Response, data: any) => {
    res.status(400).json({
      success: false,
      message: 'Missing Parameters',
      data: data,
    });
  },
  error: (res: Response, data: any) => {
    res.status(400).json({
      success: false,
      message: 'Error',
      data: data,
    });
  },
  expiredToken: (res: Response) => {
    res.status(401).json({
      success: false,
      message: 'Expired Token',
    });
  },

  authError: (res: Response, data: any) => {
    res.status(401).json({
      success: false,
      message: 'Authentication Error',
      data: data,
    });
  },
  authAdminError: (res: Response, data: any) => {
    res.status(403).json({
      success: false,
      message: 'Admin Authentication Error',
      data: data,
    });
  },
  serverError: (res: Response, data: any) => {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      data: data,
    });
  },
};

export default sendResponse;
