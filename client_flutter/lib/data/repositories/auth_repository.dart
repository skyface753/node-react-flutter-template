import 'package:client_flutter/dio_helper.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthRepository {
  // final _firebaseAuth = FirebaseAuth.instance;
  Future<void> signUp({required String email, required String password}) async {
    try {
      print("SIGNUP");

      //   await FirebaseAuth.instance
      //       .createUserWithEmailAndPassword(email: email, password: password);
      // } on FirebaseAuthException catch (e) {
      //   if (e.code == 'weak-password') {
      //     throw Exception('The password provided is too weak.');
      //   } else if (e.code == 'email-already-in-use') {
      //     throw Exception('The account already exists for that email.');
      //   }
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> signIn({required String email, required String password}) async {
    try {
      print("SIGNIN");
    await DioHelper.geBaseDio().post('auth/login', data: {
      'email': email,
      'password': password,
    }).then((value) {
      final Map response = value.data;
      print(response);
      if (response['success']) {
        print('Login Success');
        final storage = new FlutterSecureStorage();
        storage.write(
            key: 'accessToken', value: response['data']['accessToken']);
        storage.write(
            key: 'refreshToken', value: response['data']['refreshToken']);
        storage.write(key: 'csrfToken', value: response['data']['csrfToken']);
        print("End write");
	// Navigator.pushReplacementNamed(context, HomePage.routeName);
      } else {
	      print("ERRROR 1");
	      throw Exception(response);
      }
    }).catchError((error) {
	          print("ERRROR 2");
      throw Exception(error);
	    print(error);
    });
      //     .signInWithEmailAndPassword(email: email, password: password);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> signOut() async {
    // await _firebaseAuth.signOut();
  }
}
