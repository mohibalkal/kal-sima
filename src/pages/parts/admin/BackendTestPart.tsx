import { useState } from "react";
import { useAsyncFn } from "react-use";

import { MetaResponse, getBackendMeta } from "@/backend/accounts/meta";
import { Button } from "@/components/buttons/Button";
import { Icon, Icons } from "@/components/Icon";
import { Box } from "@/components/layout/Box";
import { Divider } from "@/components/utils/Divider";
import { Heading2 } from "@/components/utils/Text";
import { conf } from "@/setup/config";

export function BackendTestPart() {
  const backendUrl = conf().BACKEND_URL;

  const [status, setStatus] = useState<{
    hasTested: boolean;
    success: boolean;
    errorText: string;
    value: MetaResponse | null;
  }>({
    hasTested: false,
    success: false,
    errorText: "",
    value: null,
  });

  const [testState, runTests] = useAsyncFn(async () => {
    setStatus({
      hasTested: false,
      success: false,
      errorText: "",
      value: null,
    });

    if (!backendUrl) {
      return setStatus({
        hasTested: true,
        success: false,
        errorText: "Backend URL is not set in configuration",
        value: null,
      });
    }

    try {
      const backendData = await getBackendMeta(backendUrl);

      // التحقق من صحة البيانات المستلمة
      if (!backendData.version || !backendData.name) {
        throw new Error("Invalid backend response: missing required fields");
      }

      return setStatus({
        hasTested: true,
        success: true,
        errorText: "",
        value: backendData,
      });
    } catch (err) {
      const error = err as Error;
      return setStatus({
        hasTested: true,
        success: false,
        errorText:
          error.message === "Invalid backend response: missing required fields"
            ? "Backend response is invalid. Please check the backend implementation."
            : "Failed to connect to backend. Please check:\n1. Backend URL is correct\n2. Backend server is running\n3. CORS is properly configured\n4. Your internet connection",
        value: null,
      });
    }
  }, [backendUrl]);

  return (
    <>
      <Heading2 className="!mb-0 mt-12">Backend API test</Heading2>
      <p className="mb-8 mt-2 text-gray-400">
        Testing connection to: {backendUrl || "Not configured"}
      </p>
      <Box>
        {status.hasTested && status.success && status.value ? (
          <div className="mb-6">
            <p className="mb-4">
              <span className="inline-block w-36 text-white font-medium">
                Version:
              </span>
              <span className="text-green-400">{status.value.version}</span>
            </p>
            <p className="mb-4">
              <span className="inline-block w-36 text-white font-medium">
                Backend name:
              </span>
              <span className="text-green-400">{status.value.name}</span>
            </p>
            <p className="mb-4">
              <span className="inline-block w-36 text-white font-medium">
                Description:
              </span>
              <span className="text-gray-300">
                {status.value.description || "Not set"}
              </span>
            </p>
            <p className="mb-4">
              <span className="inline-block w-36 text-white font-medium">
                Captcha:
              </span>
              <span
                className={
                  status.value.hasCaptcha ? "text-yellow-400" : "text-gray-400"
                }
              >
                {status.value.hasCaptcha ? "Enabled" : "Disabled"}
              </span>
              {status.value.hasCaptcha && status.value.captchaClientKey && (
                <span className="ml-2 text-xs text-gray-500">
                  (Client Key: {status.value.captchaClientKey})
                </span>
              )}
            </p>
            <Divider />
          </div>
        ) : null}
        <div className="w-full flex gap-6 justify-between items-start">
          <div className="flex-1">
            {!status.hasTested ? (
              <p className="text-gray-400">
                Run the test to validate backend connection
              </p>
            ) : status.success ? (
              <p className="flex items-center text-md">
                <Icon
                  icon={Icons.CIRCLE_CHECK}
                  className="text-video-scraping-success mr-2"
                />
                Backend is working as expected
              </p>
            ) : (
              <div>
                <p className="text-white font-bold w-full mb-3 flex items-center gap-1">
                  <Icon
                    icon={Icons.CIRCLE_EXCLAMATION}
                    className="text-video-scraping-error mr-2"
                  />
                  Backend connection failed
                </p>
                <p className="text-red-400 whitespace-pre-line">
                  {status.errorText}
                </p>
              </div>
            )}
          </div>
          <Button
            theme="purple"
            loading={testState.loading}
            className="whitespace-nowrap"
            onClick={runTests}
          >
            {status.hasTested ? "Test again" : "Test backend"}
          </Button>
        </div>
      </Box>
    </>
  );
}
