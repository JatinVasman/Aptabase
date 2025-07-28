import { useEffect, useState } from "react";
import { SignInWithAuthentik } from "./SignInWithAuthentik";
import { SignInWithGitHub } from "./SignInWithGitHub";
import { SignInWithGoogle } from "./SignInWithGoogle";
import { DEFAULT_OAUTH_STATUS } from "./auth";

type OAuthStatus = {
  github: boolean;
  google: boolean;
  authentik: boolean;
  emailAuthDisabled: boolean;
};

export function OAuthButtons() {
  const [oauthStatus, setOauthStatus] = useState<OAuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOAuthStatus = async () => {
      try {
        const response = await fetch("/api/_auth/oauth-status");
        if (response.ok) {
          const status = await response.json();
          setOauthStatus(status);
        } else {
          setOauthStatus(DEFAULT_OAUTH_STATUS);
        }
      } catch {
        setOauthStatus(DEFAULT_OAUTH_STATUS);
      } finally {
        setLoading(false);
      }
    };

    checkOAuthStatus();
  }, []);

  // Show loading state or no buttons if still loading
  if (loading) {
    return null;
  }

  // Don't show anything if no OAuth providers are available
  if (!oauthStatus || (!oauthStatus.github && !oauthStatus.google && !oauthStatus.authentik)) {
    return null;
  }

  return (
    <>
      <div className="space-y-2">
        {oauthStatus.github && <SignInWithGitHub />}
        {oauthStatus.google && <SignInWithGoogle />}
        {oauthStatus.authentik && <SignInWithAuthentik />}
      </div>
    </>
  );
}
