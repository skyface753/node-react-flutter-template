import 'package:client_flutter/bloc/auth_bloc.dart';
import 'package:client_flutter/data/repositories/auth_repository.dart';
import 'package:client_flutter/pages/home.dart';
import 'package:client_flutter/pages/login.dart';
import 'package:flutter/material.dart';
import 'package:client_flutter/dio_helper.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

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
        child: MaterialApp(home: LoginPage()),
      ),
    );
  }
}

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
