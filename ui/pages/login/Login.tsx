import { Button, Input } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [pw, setPw] = useState<string>("");
  return (
    <div>
      <h1>Login</h1>
      <Input
        placeholder="Password"
        type="password"
        value={pw}
        onChange={(e) => {
          setPw(e.currentTarget.value);
        }}
      />
      <Button
        onClick={async () => {
          const res = await fetch("/api/auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: pw }),
          });
          if (res.status === 200) {
            navigate("/admin/dashboard");
          }
        }}
      >
        Login
      </Button>
      <p>Here be yer login page, matey</p>
    </div>
  );
}
