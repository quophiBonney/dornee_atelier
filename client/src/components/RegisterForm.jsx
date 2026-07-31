import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser, clearAuthError } from "../store/slices/authSlice";
import dorneeLogo from "../assets/dornee_logo.png";
export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        registerUser({ email, password, rememberMe }),
      ).unwrap();
      toast.success("Signup successful");
      navigate("/auth/login");
    } catch (err) {
      toast.error(err);
      console.log(err?.message || err?.error || "Registration failed");
    }
  };
  return (
    <div className="min-h-screen grid w-full lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <img
            src={dorneeLogo}
            alt="Dornee Logo"
            className="w-full h-36 object-contain"
          />
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-5xl font-bold leading-tight">
              Create Account.
            </h1>
            <p className="mt-6 text-lg text-black">
              Create your account to access your dashboard, manage your
              projects, and collaborate with your team from anywhere.
            </p>
          </div>
          <form className="mt-5 space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) dispatch(clearAuthError());
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) dispatch(clearAuthError());
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-12 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Button */}

            <button
              className="w-full rounded-xl bg-gradient-to-r from-[#AA1D23] to-[#AA1D23] py-3 font-semibold text-white transition hover:scale-[1.02] hover:shadow-xl"
              type="submit"
              disabled={loading}
            >
              {loading ? <>Creating Account...</> : <>Create Account</>}
            </button>
          </form>

          {/* Divider */}

          <div className="my-8 flex items-center">
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          {/* Social Buttons */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#AA1D23] to-[#AA1D23] p-16 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative z-10 text-center">
          <div className="text-4xl">👋</div>
          <h1 className="text-5xl font-bold leading-tight uppercase">
            Complete Your Registration
          </h1>
        </div>
      </div>
    </div>
  );
}
