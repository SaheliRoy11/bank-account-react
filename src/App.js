import { useReducer } from "react";

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
};

function reducer(state, action) {
  if(!state.isActive && !action.type==="openAccount") return state;//to prevent any action other than opening an account if the account is not opened, there can be situations where we might have dispatched actions inside effects by mistake, so this acts as a caution.

  switch (action.type) {
    case "openAccount":
      return { ...state, balance: 500, isActive: true };

    case "deposit":
      return { ...state, balance: state.balance + action.payload };

    case "withdraw":
      return {
        ...state,
        balance:
          state.balance >= action.payload
            ? state.balance - action.payload
            : state.balance,
      };

    case "requestLoan":
      if(state.loan > 0) return state;

      return {
        ...state,
        balance: state.balance + action.payload,
        loan: action.payload 
      };

    case "payLoan":
      if(state.loan === 0) return state;

      return {
        ...state,
        balance: state.balance - state.loan ,
        loan: 0
      }

    case "closeAccount":
      return {...state,
        isActive: !(state.balance === 0 && state.loan === 0) 
      }

    default:
      throw new Error("Unknow action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { balance, loan, isActive } = state;

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button
          onClick={() => {
            dispatch({ type: "openAccount" });
          }}
          disabled={isActive}
        >
          Open account
        </button>
      </p>

      <p>
        <button
          onClick={() => {
            dispatch({ type: "deposit", payload: 150 });
          }}
          disabled={!isActive}
        >
          Deposit 150
        </button>
      </p>

      <p>
        <button
          onClick={() => {
            dispatch({ type: "withdraw", payload: 50 });
          }}
          disabled={!isActive}
        >
          Withdraw 50
        </button>
      </p>

      <p>
        <button onClick={() => {dispatch({type: "requestLoan", payload: 5000})}} disabled={!isActive}>
          Request a loan of 5000
        </button>
      </p>

      <p>
        <button onClick={() => {dispatch({type: "payLoan"})}} disabled={!isActive}>
          Pay loan
        </button>
      </p>

      <p>
        <button onClick={() => {dispatch({type: "closeAccount"})}} disabled={!isActive}>
          Close account
        </button>
      </p>
    </div>
  );
}
