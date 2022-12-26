import 'package:client_flutter/services/dio_service.dart';
import 'package:client_flutter/services/grpc-client.dart';
import 'package:client_flutter/src/generated/grpc-proto/auth.pbgrpc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:grpc/grpc_web.dart';

class UserState {
  int id;
  String username;
  Role roleFk;
  String? avatar;

  UserState(this.id, this.username, this.roleFk, this.avatar);

  // From Json
  // factory UserState.fromJson(Map<String, dynamic> json) {
  //   return UserState(json['id'], json['username'], json['email'],
  //       json['roleFk'], json['avatar']);
  // }
}

class AuthRepository {
  Future<Object?> signIn(
      {required String username,
      required String password,
      String? totpCode}) async {
    try {
      var resp = await GrpcClient.login(username, password, totpCode);
      //   .onError((error, stackTrace) {
      // print("Error1: $error");
      // if(error is GrpcError){
      //   if(error.code == StatusCode.unauthenticated && error.message == "TOTP code required"){
      //     return "2FA";
      //   }
      // }
      // throw Exception(error);

      if (resp.accessToken == "") {
        throw Exception("Error Access Token empty");
      }
      print("Resp: $resp");
      writeData(authResp: resp);
      UserState userState = UserState(
          resp.user.id, resp.user.username, resp.user.role, resp.user.avatar);
      return userState;
    } on GrpcError catch (GrpcError) {
      if (GrpcError.code == StatusCode.unauthenticated &&
          GrpcError.message == "TOTP code required") {
        return "2FA";
      }
    }
    // var resp = await DioService.geBaseDio().post('auth/login',
    // data: {'email': email, 'password': password, 'totpCode': totpCode});
    // if (resp. == 400 && resp.data['message'] == '2FA required') {
    //   return "2FA";
    // }
    // final Map responseMap = resp.data;
    // if (responseMap['success']) {
    //   final Map data = responseMap['data'];
    //   await writeData(data: data);
    //   final Map userData = data['user'];
    //   UserState userState = UserState(userData['id'], userData['username'],
    //       userData['email'], userData['roleFk'], userData['avatar']);
    //   return userState;
    // } else {
    //   throw Exception(responseMap['message']);
    // }
  }

  Future<bool> changeAvatar(String? avatar) async {
    // Get old state
    final storage = new FlutterSecureStorage();
    await storage.write(key: 'avatar', value: avatar!);
    return true;
  }

  Future<void> writeData({required DefaultAuthResponse authResp}) async {
    const storage = FlutterSecureStorage();
    await storage.write(key: 'accessToken', value: authResp.accessToken);
    await storage.write(key: 'refreshToken', value: authResp.refreshToken);
    await storage.write(key: 'csrfToken', value: authResp.csrfToken);
    await storage.write(key: 'userId', value: authResp.user.id.toString());
    await storage.write(key: 'username', value: authResp.user.username);
    await storage.write(
        key: 'roleFk', value: authResp.user.role.value.toString());
    await storage.write(key: 'avatar', value: authResp.user.avatar);
  }

  Future<void> clearData() async {
    const storage = FlutterSecureStorage();

    storage.deleteAll();
  }

  Future<UserState?> signUp(
      {required String password, required String username}) async {
    var resp = await GrpcClient.register(username, password)
        .onError((error, stackTrace) {
      print("Error1: $error");
      throw Exception(error);
    });
    if (resp.accessToken == "") {
      throw Exception("Error Access Token empty");
    }
    print("Resp: $resp");
    writeData(authResp: resp);
    UserState userState = UserState(
        resp.user.id, resp.user.username, resp.user.role, resp.user.avatar);
    return userState;
    // var response = await DioService.geBaseDio().put('auth/register', data: {
    //   'email': email,
    //   'password': password,
    //   'username': username,
    // }).then((value) {
    //   final Map response = value.data;
    //   if (response['success']) {
    //     print('Register Success');
    //     final Map data = response['data'];
    //     writeData(data: data);
    //     return data['user'];
    //   } else {
    //     throw Exception("Something went wrong");
    //   }
    // }).catchError((error) {
    //   throw Exception("Register Failed");
    // });
    // UserState user = UserState(response['id'], response['username'],
    //     response['email'], response['roleFk'], response['avatar']);
    // return user;
    //     .signInWithEmailAndPassword(email: email, password: password);
  }

  Future<void> signOut() async {
    try {
      String? refreshToken =
          await FlutterSecureStorage().read(key: 'refreshToken');
      await GrpcClient.logout(refreshToken ?? "");
      await clearData();
    } catch (e) {
      print(e);
      await clearData();
    }
  }

  Future<UserState?> isSignedIn() async {
    const storage = FlutterSecureStorage();
    String? accessToken = await storage.read(key: 'accessToken');
    String? refreshToken = await storage.read(key: 'refreshToken');
    String? csrfToken = await storage.read(key: 'csrfToken');
    String? userId = await storage.read(key: 'userId');
    String? username = await storage.read(key: 'username');
    String? roleFk = await storage.read(key: 'roleFk');
    String? avatar = await storage.read(key: 'avatar');

    if (accessToken != null &&
        refreshToken != null &&
        csrfToken != null &&
        userId != null &&
        username != null &&
        roleFk != null) {
      print("User is signed in");
      try {
        Role role = Role.values[int.parse(roleFk)];
        return UserState(int.parse(userId), username, role, avatar);
      } catch (e) {
        print("Error: $e");
        // Delete all data
        await clearData();
      }
      // return UserState(
      //     int.parse(userId), username, email, int.parse(roleFk), avatar);
    } else {
      print("Access token: $accessToken");
      print("Refresh token: $refreshToken");
      print("CSRF token: $csrfToken");
      print("User ID: $userId");
      print("Username: $username");
      print("Role: $roleFk");
      print("User is not signed in");

      return null;
    }
  }
}
