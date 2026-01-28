type PasswordResetEmailProps = {
  userName: string
  resetUrl: string
  requestTime: string
}

const PasswordResetEmail = ({
  userName,
  resetUrl,
  requestTime
}: PasswordResetEmailProps) => `
<html dir="ltr" lang="en">
  <head></head>
  <body style="background-color: #f3f4f6; padding-top: 40px; padding-bottom: 40px; font-family: sans-serif;">
    <div style="margin-left: auto; margin-right: auto; max-width: 600px; border-radius: 8px; background-color: #ffffff; padding: 40px; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);">
      <!-- Header -->
      <div style="margin-bottom: 32px; text-align: center;">
        <p style="margin: 0; font-weight: bold; font-size: 24px; color: #111827;">
          Reset Your Password
        </p>
      </div>

      <div style="margin-bottom: 32px;">
        <p style="margin-bottom: 16px; font-size: 16px; color: #374151; line-height: 24px;">
          Hi ${userName},
        </p>
        <p style="margin-bottom: 16px; font-size: 16px; color: #374151; line-height: 24px;">
          We received a request to reset your password ${requestTime}. If you made this request, click the button below to create a new password.
        </p>
        <p style="margin-bottom: 24px; font-size: 16px; color: #374151; line-height: 24px;">
          This password reset link will expire in 1 hour for your security.
        </p>
      </div>

      <div style="margin-bottom: 32px; text-align: center;">
        <a
          href="${resetUrl}"
          style="box-sizing: border-box; border-radius: 6px; background-color: #dc2626; padding-left: 32px; padding-right: 32px; padding-top: 12px; padding-bottom: 12px; font-weight: 600; font-size: 16px; color: #ffffff; text-decoration: none;"
        >
          Reset Password
        </a>
      </div>

      <div style="margin-bottom: 32px;">
        <p style="margin-bottom: 8px; font-size: 14px; color: #4b5563; line-height: 20px;">
          If the button doesn&apos;t work, you can copy and paste this link into your browser:
        </p>
        <p style="word-break: break-all; font-size: 14px; color: #2563eb;">
          ${resetUrl}
        </p>
      </div>

      <hr style="margin-top: 24px; margin-bottom: 24px; border-color: #e5e7eb;" />

      <div style="margin-bottom: 24px;">
        <p style="margin-bottom: 16px; font-size: 14px; color: #4b5563; line-height: 20px;">
          <strong>Security Notice:</strong>
        </p>
        <p style="margin-bottom: 12px; font-size: 14px; color: #4b5563; line-height: 20px;">
          • If you didn&apos;t request a password reset, please ignore this email. Your password will remain unchanged.
        </p>
        <p style="margin-bottom: 12px; font-size: 14px; color: #4b5563; line-height: 20px;">
          • For your security, this link can only be used once and expires in 1 hour.
        </p>
        <p style="margin-bottom: 12px; font-size: 14px; color: #4b5563; line-height: 20px;">
          • If you continue to receive these emails, please contact our support team immediately.
        </p>
      </div>

      <div style="margin-bottom: 24px; border-radius: 6px; background-color: #f9fafb; padding: 20px;">
        <p style="margin-bottom: 8px; font-weight: 600; font-size: 14px; color: #374151; line-height: 20px;">
          Need Help?
        </p>
        <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 20px;">
          If you&apos;re having trouble with your password reset, please contact our support team at support@yourcompany.com or visit our help center.
        </p>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
        <p style="margin: 0; margin-bottom: 8px; font-size: 12px; color: #6b7280; line-height: 16px;">
          This email was sent by Your Company Name
        </p>
        <p style="margin: 0; margin-bottom: 8px; font-size: 12px; color: #6b7280; line-height: 16px;">
          123 Business Street, Suite 100, City, State 12345
        </p>
        <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 16px;">
          © ${new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
  `

export { PasswordResetEmail }

// import {
//   Body,
//   Button,
//   Container,
//   Head,
//   Hr,
//   Html,
//   Section,
//   Tailwind,
//   Text,
// } from "@react-email/components"

// type PasswordResetEmailProps = {
//   userName: string
//   resetUrl: string
//   requestTime: string
// }

// const PasswordResetEmail = ({
//   userName,
//   resetUrl,
//   requestTime,
// }: PasswordResetEmailProps) => {
//   return (
//     <Html dir="ltr" lang="en">
//       <Tailwind>
//         <Head />
//         <Body className="bg-gray-100 py-[40px] font-sans">
//           <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-sm">
//             {/* Header */}
//             <Section className="mb-[32px] text-center">
//               <Text className="m-0 font-bold text-[24px] text-gray-900">
//                 Reset Your Password
//               </Text>
//             </Section>

//             {/* Main Content */}
//             <Section className="mb-[32px]">
//               <Text className="mb-[16px] text-[16px] text-gray-700 leading-[24px]">
//                 Hi {userName},
//               </Text>
//               <Text className="mb-[16px] text-[16px] text-gray-700 leading-[24px]">
//                 We received a request to reset your password {requestTime}. If
//                 you made this request, click the button below to create a new
//                 password.
//               </Text>
//               <Text className="mb-[24px] text-[16px] text-gray-700 leading-[24px]">
//                 This password reset link will expire in 1 hour for your
//                 security.
//               </Text>
//             </Section>

//             {/* Reset Button */}
//             <Section className="mb-[32px] text-center">
//               <Button
//                 className="box-border rounded-[6px] bg-red-600 px-[32px] py-[12px] font-semibold text-[16px] text-white no-underline hover:bg-red-700"
//                 href={resetUrl}
//               >
//                 Reset Password
//               </Button>
//             </Section>

//             {/* Alternative Link */}
//             <Section className="mb-[32px]">
//               <Text className="mb-[8px] text-[14px] text-gray-600 leading-[20px]">
//                 If the button doesn&apos;t work, you can copy and paste this
//                 link into your browser:
//               </Text>
//               <Text className="break-all text-[14px] text-blue-600">
//                 {resetUrl}
//               </Text>
//             </Section>

//             <Hr className="my-[24px] border-gray-200" />

//             {/* Security Notice */}
//             <Section className="mb-[24px]">
//               <Text className="mb-[16px] text-[14px] text-gray-600 leading-[20px]">
//                 <strong>Security Notice:</strong>
//               </Text>
//               <Text className="mb-[12px] text-[14px] text-gray-600 leading-[20px]">
//                 • If you didn&apos;t request a password reset, please ignore
//                 this email. Your password will remain unchanged.
//               </Text>
//               <Text className="mb-[12px] text-[14px] text-gray-600 leading-[20px]">
//                 • For your security, this link can only be used once and expires
//                 in 1 hour.
//               </Text>
//               <Text className="mb-[12px] text-[14px] text-gray-600 leading-[20px]">
//                 • If you continue to receive these emails, please contact our
//                 support team immediately.
//               </Text>
//             </Section>

//             {/* Help Section */}
//             <Section className="mb-[24px] rounded-[6px] bg-gray-50 p-[20px]">
//               <Text className="mb-[8px] font-semibold text-[14px] text-gray-700 leading-[20px]">
//                 Need Help?
//               </Text>
//               <Text className="m-0 text-[14px] text-gray-600 leading-[20px]">
//                 If you&apos;re having trouble with your password reset, please
//                 contact our support team at support@yourcompany.com or visit our
//                 help center.
//               </Text>
//             </Section>

//             {/* Footer */}
//             <Section className="border-gray-200 border-t pt-[24px]">
//               <Text className="m-0 mb-[8px] text-[12px] text-gray-500 leading-[16px]">
//                 This email was sent by Your Company Name
//               </Text>
//               <Text className="m-0 mb-[8px] text-[12px] text-gray-500 leading-[16px]">
//                 123 Business Street, Suite 100, City, State 12345
//               </Text>
//               <Text className="m-0 text-[12px] text-gray-500 leading-[16px]">
//                 © {new Date().getFullYear()} Your Company Name. All rights
//                 reserved.
//               </Text>
//             </Section>
//           </Container>
//         </Body>
//       </Tailwind>
//     </Html>
//   )
// }

// export { PasswordResetEmail }
