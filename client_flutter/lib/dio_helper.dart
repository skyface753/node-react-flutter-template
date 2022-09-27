import 'package:dio/dio.dart';

class DioHelper {
  static Dio dio = Dio();
  static init() {
    dio = Dio(
      BaseOptions(
        baseUrl: 'http://localhost:5000/api/',
        receiveDataWhenStatusError: true,
      ),
    );
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          print(
            '${options.method} ${options.path}',
          );
          return handler.next(options);
        },
        onResponse: (response, handler) {
          print(
            '${response.statusCode} ${response.statusMessage}',
          );
          return handler.next(response);
        },
        onError: (DioError e, handler) {
          print("Error status: ${e.response?.statusCode}");
          // print(
          //   '${e.response?.statusCode} ${e.response?.statusMessage}',
          // );
          return handler.next(e);
        },
      ),
    );
  }

  static Future<Response> getData({
    required String url,
    required Map<String, dynamic> query,
  }) async {
    return await dio.get(
      url,
      queryParameters: query,
    );
  }
}
