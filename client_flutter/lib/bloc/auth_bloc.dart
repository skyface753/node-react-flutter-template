import 'dart:io';

import 'package:bloc/bloc.dart';
import 'package:client_flutter/data/repositories/auth_repository.dart';
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository authRepository;
  AuthBloc({required this.authRepository}) : super(UnAuthenticated()) {
    // When User Presses the SignIn Button, we will send the SignInRequested Event to the AuthBloc to handle it and emit the Authenticated State if the user is authenticated
    on<SignInRequested>((event, emit) async {
      emit(Loading());
      try {
        await authRepository
            .signIn(email: event.email, password: event.password)
            .then((value) => {
                  print("Emitted Authenticated"),
                  print(value),
                  emit(Authenticated(
                      email: value!.email, username: value.username))
                });
      } catch (e) {
        emit(AuthError(e.toString()));
        emit(UnAuthenticated());
      }
    });
    // When User Presses the SignUp Button, we will send the SignUpRequest Event to the AuthBloc to handle it and emit the Authenticated State if the user is authenticated
    on<SignUpRequested>((event, emit) async {
      emit(Loading());
      try {
        await authRepository
            .signUp(
                email: event.email,
                password: event.password,
                username: event.username)
            .then((value) => {
                  print("Emitted Register Authenticated"),
                  print(value),
                  emit(Authenticated(
                      email: value!.email, username: value.username))
                });
      } catch (e) {
        emit(AuthError(e.toString()));
        emit(UnAuthenticated());
      }
    });
    // When User Presses the SignOut Button, we will send the SignOutRequested Event to the AuthBloc to handle it and emit the UnAuthenticated State
    on<SignOutRequested>((event, emit) async {
      emit(Loading());
      await authRepository.signOut();
      emit(UnAuthenticated());
    });
    // When the App Starts, we will send the OnStartUp Event to the AuthBloc to handle it and emit the Authenticated State if the user is authenticated
    // on<OnStartUp>((event, emit) async {
    //   emit(Loading());
    //   final bool isSignedIn = await authRepository.();
    //   if (isSignedIn) {
    //     emit(Authenticated());
    //   } else {
    //     emit(UnAuthenticated());
    //   }
    // });
  }
}
