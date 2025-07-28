import { Button } from "@components/Button";

export function SignInWithAuthentik() {
  const url = `/api/_auth/authentik`;

  return (
    <Button asChild>
      <a href={url} className="flex justify-center w-full">
        <span>Continue via OIDC</span>
      </a>
    </Button>
  );
}
