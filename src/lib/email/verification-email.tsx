type VerificationEmailProps = {
  userName: string
  verificationUrl: string
}
const VerificationEmail = ({
  userName,
  verificationUrl
}: VerificationEmailProps) => `
<html dir="ltr" lang="en">
  <head></head>
  <body style="background-color: #f3f4f6; padding-top: 40px; padding-bottom: 40px; font-family: sans-serif;">
    <div style="margin-left: auto; margin-right: auto; max-width: 600px; border-radius: 8px; background-color: #ffffff; padding: 40px; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);">
      <div style="margin-bottom: 32px; text-align: center;">
        <p style="margin: 0; font-weight: bold; font-size: 24px; color: #111827;">
          Verify Your Email Address
        </p>
      </div>

      <div style="margin-bottom: 32px;">
        <p style="margin-bottom: 16px; font-size: 16px; color: #374151; line-height: 24px;">
          Hi ${userName},
        </p>
        <p style="margin-bottom: 16px; font-size: 16px; color: #374151; line-height: 24px;">
          Thank you for signing up! To complete your account setup and start using our services, please verify your email address by clicking the button below.
        </p>
        <p style="margin-bottom: 24px; font-size: 16px; color: #374151; line-height: 24px;">
          This verification link will expire in 24 hours for security purposes.
        </p>
      </div>

      <div style="margin-bottom: 32px; text-align: center;">
        <a
          href="${verificationUrl}"
          style="box-sizing: border-box; border-radius: 6px; background-color: #2563eb; padding-left: 32px; padding-right: 32px; padding-top: 12px; padding-bottom: 12px; font-weight: 600; font-size: 16px; color: #ffffff; text-decoration: none;"
        >
          Verify Email Address
        </a>
      </div>

      <div style="margin-bottom: 32px;">
        <p style="margin-bottom: 8px; font-size: 14px; color: #4b5563; line-height: 20px;">
          If the button doesn&apos;t work, you can copy and paste this link into your browser:
        </p>
        <p style="word-break: break-all; font-size: 14px; color: #2563eb;">
          ${verificationUrl}
        </p>
      </div>

      <hr style="margin-top: 24px; margin-bottom: 24px; border-color: #e5e7eb;" />

      <div style="margin-bottom: 24px;">
        <p style="margin-bottom: 8px; font-size: 14px; color: #4b5563; line-height: 20px;">
          <strong>Security Notice:</strong>
        </p>
        <p style="font-size: 14px; color: #4b5563; line-height: 20px;">
          If you didn&apos;t create an account with us, please ignore this email. Your email address will not be added to our system without verification.
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

export { VerificationEmail }

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

// type VerificationEmailProps = {
//   userName: string
//   verificationUrl: string
// }

// const VerificationEmail = ({
//   userName,
//   verificationUrl,
// }: VerificationEmailProps) => {
//   return (
//     <Html dir="ltr" lang="en">
//       <Tailwind>
//         <Head />
//         <Body className="bg-gray-100 py-[40px] font-sans">
//           <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-sm">
//             {/* Header */}
//             <Section className="mb-[32px] text-center">
//               <Text className="m-0 font-bold text-[24px] text-gray-900">
//                 Verify Your Email Address
//               </Text>
//             </Section>

//             {/* Main Content */}
//             <Section className="mb-[32px]">
//               <Text className="mb-[16px] text-[16px] text-gray-700 leading-[24px]">
//                 Hi {userName},
//               </Text>
//               <Text className="mb-[16px] text-[16px] text-gray-700 leading-[24px]">
//                 Thank you for signing up! To complete your account setup and
//                 start using our services, please verify your email address by
//                 clicking the button below.
//               </Text>
//               <Text className="mb-[24px] text-[16px] text-gray-700 leading-[24px]">
//                 This verification link will expire in 24 hours for security
//                 purposes.
//               </Text>
//             </Section>

//             {/* Verification Button */}
//             <Section className="mb-[32px] text-center">
//               <Button
//                 className="box-border rounded-[6px] bg-blue-600 px-[32px] py-[12px] font-semibold text-[16px] text-white no-underline hover:bg-blue-700"
//                 href={verificationUrl}
//               >
//                 Verify Email Address
//               </Button>
//             </Section>

//             {/* Alternative Link */}
//             <Section className="mb-[32px]">
//               <Text className="mb-[8px] text-[14px] text-gray-600 leading-[20px]">
//                 If the button doesn&apos;t work, you can copy and paste this
//                 link into your browser:
//               </Text>
//               <Text className="break-all text-[14px] text-blue-600">
//                 {verificationUrl}
//               </Text>
//             </Section>

//             <Hr className="my-[24px] border-gray-200" />

//             {/* Security Notice */}
//             <Section className="mb-[24px]">
//               <Text className="mb-[8px] text-[14px] text-gray-600 leading-[20px]">
//                 <strong>Security Notice:</strong>
//               </Text>
//               <Text className="text-[14px] text-gray-600 leading-[20px]">
//                 If you didn &apos;t create an account with us, please ignore
//                 this email. Your email address will not be added to our system
//                 without verification.
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

// export { VerificationEmail }
