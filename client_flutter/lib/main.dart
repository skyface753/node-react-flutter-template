import 'package:client_flutter/bloc/auth_bloc.dart';
import 'package:client_flutter/data/repositories/auth_repository.dart';
import 'package:client_flutter/pages/home.dart';
import 'package:client_flutter/pages/login.dart';
import 'package:flutter/material.dart';
import 'package:client_flutter/dio_helper.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return RepositoryProvider(
      create: (context) => AuthRepository(),
      child: BlocProvider(
        create: (context) => AuthBloc(
          authRepository: RepositoryProvider.of<AuthRepository>(context),
        ),
        child: MaterialApp(
            home:
                // StreamBuilder<User?>(
                //   stream: getUser(),
                //   builder: (context, snapshot) {
                //     if (snapshot.hasData) {
                //       return HomePage();
                //     } else {
                LoginPage()
            //   }
            // },

            ),
      ),
    );
  }
}

// Stream<User?> getUser() async* {
//   const storage = FlutterSecureStorage();
//   final accessToken = await storage.read(key: 'accessToken');
//   final refreshToken = await storage.read(key: 'refreshToken');
//   final csrfToken = await storage.read(key: 'csrfToken');
//   final userId = await storage.read(key: 'userId');
//   final username = await storage.read(key: 'username');
//   final email = await storage.read(key: 'email');
//   final roleFk = await storage.read(key: 'roleFk');
//   final avatar = await storage.read(key: 'avatar');
//   print("Data loaded");
//   if (accessToken != null &&
//       refreshToken != null &&
//       csrfToken != null &&
//       userId != null &&
//       username != null &&
//       email != null &&
//       roleFk != null) {
//     print("Should be logged in");
//     return User(int.parse(userId), username, email, int.parse(roleFk), avatar);
//   } else {
//     yield null;
//   }
// }

// class MyApp extends StatelessWidget {
//   const MyApp({super.key});

//   // This widget is the root of your application.
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//         title: 'Flutter Demo',
//         theme: ThemeData(

// 		// This is the theme of your application.
//           //
//           // Try running your application with "flutter run". You'll see the
//           // application has a blue toolbar. Then, without quitting the app, try
//           // changing the primarySwatch below to Colors.green and then invoke
//           // "hot reload" (press "r" in the console where you ran "flutter run",
//           // or simply save your changes to "hot reload" in a Flutter IDE).
//           // Notice that the counter didn't reset back to zero; the application
//           // is not restarted.
//           primarySwatch: Colors.blue,
//         ),
// debugShowCheckedModeBanner: false,
// 	routes: {
//           HomePage.routeName: (context) => HomePage(),
//           LoginPage.routeName: (context) => LoginPage(),
//         },
//         // home: const MyHomePage(title: 'Flutter Demo Home Page'),
//         home: HomePage());
//   }
// }

//   // _testApi() async {
//   //   final response = await DioHelper.getData(
//   //     url: 'auth/status',
//   //     query: {
  //       'country': 'us',
  //       'apiKey': 'YOUR_API_KEY',
  //     },
  //   );
  //   print(response.data);
  // }
