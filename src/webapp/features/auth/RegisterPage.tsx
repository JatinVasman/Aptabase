import { Page } from "@components/Page";
import { useEffect, useState } from "react";
import { DataResidency } from "./DataResidency";
import { LegalNotice } from "./LegalNotice";
import { Logo } from "./Logo";
import { OAuthButtons } from "./OAuthButtons";

type OAuthStatus = {
  github: boolean;
  google: boolean;
  authentik: boolean;
  emailAuthDisabled: boolean;
};

export function Component() {
  const [oauthStatus, setOauthStatus] = useState<OAuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOAuthStatus = async () => {
      try {
        const response = await fetch("/api/_auth/oauth-status");
        const status = await response.json();
        setOauthStatus(status);
      } catch {
        setOauthStatus(null);
      } finally {
        setLoading(false);
      }
    };

    checkOAuthStatus();
  }, []);

  if (loading) {
    return (
      <Page title="Sign up">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Logo className="mx-auto h-12 w-auto text-primary" />
          <h2 className="text-center text-3xl font-bold">Sign up for an account</h2>
          <DataResidency />
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 px-4 sm:rounded-lg sm:px-10 text-center text-muted-foreground">Loading...</div>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Sign up">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo className="mx-auto h-12 w-auto text-primary" />
        <h2 className="text-center text-3xl font-bold">Sign up for an account</h2>
        <DataResidency />
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:rounded-lg sm:px-10">
          <OAuthButtons />
        </div>
        <LegalNotice operation="signup" />
      </div>
    </Page>
  );
}
