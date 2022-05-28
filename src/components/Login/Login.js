import React, { useState, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const emailReducer = (state, action) => { // 여기의 state 는 최신 state snapshot 임이 보장된다 (react 가 제공)
  if (action.type === 'USER_INPUT') {
    return { value: action.payload, isValid: action.payload.includes('@') }
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') }
  }
  return { value: '', isValid: false }
}

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.payload, isValid: action.payload.trim().length > 6 }
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 }
  }
  return { value: '', isValid: false }
}
// 컴포넌트 함수 바깥에 만들어짐 : 컴포넌트 함수 내부에서 만들어진 데이터가 불필요하기 때문 (상호작용X)
// 인자 : 최신 state snapshot, dispatched action 

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '', 
    isValid: null, 
  })

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null, 
  })

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);

    dispatchEmail({ type: 'USER_INPUT', payload: event.target.value }) 
    // dispatch Function 을 호출하여 state 값을 update 하고, action 에 전달
    // action 은 사용자가 정의할 수 있다. 형식은 자유이지만, 보통 객체.
    // 보통 다음과 같은 형식을 따른다 : { type: 식별자, paylod: 전달하고싶은 값 }
    // 그러면 useReducer 에 이 dispatchEmail 이라는 리듀서 함수를 전달했기 때문에
    // useReducer 에서 전달한 액션 = {type: 'USER_INPUT', val: '...'} 을 처리할 수 있다

    setFormIsValid(
      emailState.isValid && passwordState.isValid
    );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({ type: 'USER_INPUT', payload: event.target.value })

    setFormIsValid(
      emailState.value.includes('@') && event.target.value.trim().length > 6
    )
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.isValid);
    dispatchEmail({ type: 'INPUT_BLUR' })
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPassword({ type: 'INPUT_BLUR' })
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
