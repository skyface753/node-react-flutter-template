import 'package:client_flutter/dio_helper.dart';
import 'package:client_flutter/pages/login.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  static String routeName = '/home';
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  _testApi() async {
print("Test api auth status");
    Response response = await dio.get('auth/status');
    print(response.data);
    final Map responseMap = response.data;
    if (responseMap['success']) {
    authStatus = "Authenticated";
    } else {
	        authStatus = "Not Authenticated";

    }
    setState(() {
      
    });
  }

    Dio dio = DioHelper().getApi();
  String authStatus = "Loading";
    @override
  void initState() {
    super.initState();
    _testApi();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () {
              // TODO LOGOUT
              Navigator.pushReplacementNamed(context, LoginPage.routeName);
            },
          ),
	  //Refresh Button
	  IconButton(
	    icon: Icon(Icons.refresh),
	    onPressed: () {
	      _testApi();
	    },
	  ),
	],
        
      ),
      body: Center(
        child: Text(authStatus),
	      ),
    );
  }
}
