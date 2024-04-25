import { useState, FormEvent } from "react";
import { FdpStorage, FdpContracts } from "@fairdatasociety/fdp-storage";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";

interface LoginProps {
  onLogin: (fdp: FdpStorage) => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    try {
      event.preventDefault();

      setValidated(true);
      setError(false);
      setLoading(true);

      if (!username || !password) {
        return;
      }

      const env = import.meta.env.PROD
        ? FdpContracts.Environments.SEPOLIA
        : FdpContracts.Environments.LOCALHOST;

      const fdp = new FdpStorage(
        import.meta.env.VITE_BEE_NODE_URL,
        import.meta.env.VITE_POSTAGE_STAMP_ID,
        {
          ensOptions: FdpContracts.getEnsEnvironmentConfig(env),
          dataHubOptions: FdpContracts.getDataHubEnvironmentConfig(env),
        }
      );

      await fdp.account.login(username, password);

      onLogin(fdp);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal.Dialog>
        <Form noValidate validated={validated} onSubmit={onSubmit}>
          <Modal.Header>
            <Modal.Title>FDS Login</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Please log in using your FDS username and password.</p>

            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  disabled={loading}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a username.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your password.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            {error && (
              <Alert variant="danger">
                Couldn't log in. Check your username and password.
              </Alert>
            )}
            <span>
              Don&#39;t have an account? Create{" "}
              <a href="https://create.fairdatasociety.org/" target="_blank">
                here
              </a>
              .
            </span>
            <Button disabled={loading} variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Dialog>
    </div>
  );
}

export default Login;
