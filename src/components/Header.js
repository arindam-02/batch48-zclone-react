import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import Swal from "sweetalert2";

function Header(props) {
  let navigate = useNavigate();
  let getTokenDetails = () => {
    //read the token data from localstorage
    let token = localStorage.getItem("auth-token");

    if (token === null) {
      return false;
    } else {
      return jwt_decode(token);
    }
  };

  let [isLogin, setIsLogin] = useState(getTokenDetails());

  let onSuccess = (credentialResponse) => {
    let token = credentialResponse.credential;

    // save the data
    localStorage.setItem("auth-token", token);
    // alert("You are logged in Successfully");
    Swal.fire(
      "Welcome Back !",
      "You Have Logged In Successfully !!",
      "success"
    ).then(() => {
      window.location.assign("/");
    });
  };
  let onerror = () => {
    // alert("Login/SignIn Failed");
    Swal.fire("Opps...", "Login Fail ! Try Again", "error");
  };

  let logout = () => {
    //remove data from localstoage
    //removeItem

    Swal.fire({
      title: "Are you sure to Logout?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log me out",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("auth-token");
        window.location.assign("/");
      }
    });

    // alert("Logged Out");
  };
  return (
    <GoogleOAuthProvider clientId="953241947824-v6crukrp9tlq8gnm641q4p476n4qaok9.apps.googleusercontent.com">
      <>
        {/* <!-- Modal --> */}
        <div
          className="modal fade"
          id="google-sign-in"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Google Sign In
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <GoogleLogin onSuccess={onSuccess} onError={onerror} />
              </div>
            </div>
          </div>
        </div>
        {/* ///////////////////////////// */}
        <section className={"row d-flex justify-content-center " + props.color}>
          <header className="col-lg-10 col-12 d-flex justify-content-between pt-3">
            <p
              className="brand hand"
              onClick={() => {
                navigate("/");
              }}
            >
              e!
            </p>
            {isLogin ? (
              <div>
                <span className="text-warning fs-5 me-1 fw-bold">
                  Hey {isLogin.given_name} ,
                </span>

                <button
                  className="btn btn-outline-light fw-bold ms-3"
                  onClick={logout}
                >
                  <i className="fa fa-exit">Logout</i>
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="btn text-white fw-bold"
                  data-bs-toggle="modal"
                  data-bs-target="#google-sign-in"
                >
                  Login
                </button>
                <button className="btn border border-light text-white fw-bold">
                  Create an account
                </button>
              </div>
            )}
          </header>
        </section>
      </>
    </GoogleOAuthProvider>
  );
}
export default Header;
