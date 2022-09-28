import 'package:client_flutter/dio_helper.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class UserState {
  int id;
  String username;
  String email;
  int roleFk;
  String? avatar;

  UserState(this.id, this.username, this.email, this.roleFk, this.avatar);
}

class AuthRepository {
  Future<UserState?> signIn(
      {required String email, required String password}) async {
    var response = await DioHelper.geBaseDio().post('auth/login', data: {
      'email': email,
      'password': password,
    }).then((value) {
      final Map response = value.data;
      print(response);
      if (response['success']) {
        print('Login Success');
        final Map data = response['data'];
        writeData(data: data);
        return data['user'];
      } else {
        throw Exception("Something went wrong");
      }
    }).catchError((error) {
      throw Exception("Login Failed");
    });
    UserState user = UserState(response['id'], response['username'],
        response['email'], response['roleFk'], response['avatar']);
    return user;
  }

  Future<void> writeData({required Map data}) async {
    const storage = FlutterSecureStorage();
    await storage.write(key: 'accessToken', value: data['accessToken']);
    await storage.write(key: 'refreshToken', value: data['refreshToken']);
    await storage.write(key: 'csrfToken', value: data['csrfToken']);
    await storage.write(key: 'userId', value: data['user']['id'].toString());
    await storage.write(key: 'username', value: data['user']['username']);
    await storage.write(key: 'email', value: data['user']['email']);
    await storage.write(
        key: 'roleFk', value: data['user']['roleFk'].toString());
    await storage.write(key: 'avatar', value: data['user']['avatar']);
  }

  Future<void> clearData() async {
    const storage = FlutterSecureStorage();

    storage.deleteAll();
  }

  Future<UserState?> signUp(
      {required String email,
      required String password,
      required String username}) async {
    var response = await DioHelper.geBaseDio().put('auth/register', data: {
      'email': email,
      'password': password,
      'username': username,
    }).then((value) {
      final Map response = value.data;
      if (response['success']) {
        print('Register Success');
        final Map data = response['data'];
        writeData(data: data);
        return data['user'];
      } else {
        throw Exception("Something went wrong");
      }
    }).catchError((error) {
      throw Exception("Register Failed");
    });
    UserState user = UserState(response['id'], response['username'],
        response['email'], response['roleFk'], response['avatar']);
    return user;
    //     .signInWithEmailAndPassword(email: email, password: password);
  }

  Future<void> signOut() async {
    String? refreshToken =
        await FlutterSecureStorage().read(key: 'refreshToken');
    await DioHelper.geBaseDio().post('auth/logout', data: {
      'refreshToken': refreshToken,
    }).then((value) {});
    await clearData();
  }

  // Future<bool> isSignedIn() async {
  //   const storage = FlutterSecureStorage();
  //   final accessToken = await storage.read(key: 'accessToken');
  //   final refreshToken = await storage.read(key: 'refreshToken');
  //   final csrfToken = await storage.read(key: 'csrfToken');
  //   final userId = await storage.read(key: 'userId');
  //   final username = await storage.read(key: 'username');
  //   final email = await storage.read(key: 'email');
  //   final roleFk = await storage.read(key: 'roleFk');
  //   final avatar = await storage.read(key: 'avatar');
  //   if (accessToken != null &&
  //       refreshToken != null &&
  //       csrfToken != null &&
  //       userId != null &&
  //       username != null &&
  //       email != null &&
  //       roleFk != null &&
  //       avatar != null) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  //   // rddeturn true;
  // }

}
