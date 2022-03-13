import { useState } from "react";
import { Card, Form } from "semantic-ui-react";

function SignIn() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("hello");
  };

  return (
    <Card centered className="signin-form">
      <Card.Header className="header">
        <h1>Sign In</h1>
      </Card.Header>
      <Card.Content>
        <Form onSubmit={handleFormSubmit}>
          <Form.Field>
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </Form.Field>
          <button className="ui button" type="submit">
            Sign In
          </button>
        </Form>
      </Card.Content>
    </Card>
  );
}

export default SignIn;
