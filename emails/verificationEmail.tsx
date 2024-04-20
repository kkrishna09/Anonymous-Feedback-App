import {Html,Head,Font,Preview,Heading,Row,Section,Text,Button} from "@react-email/components"

interface VeriificationEmailProps{
    username:string,
    otp:string
}

export default function VerificationEmail({username,otp}:VeriificationEmailProps){
    return <Html lang="en" dir="itr">
        <Head>
            <title>Verification Code</title>
            {/* <Font
            fontFamily="Roboto"
            fallbackFontFamily={"Verdana"}
            webFont={{
                url:"https://fonts.gstatic.com/s/roboto/v27/kFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                format:"woff2"
            }}> */}


        </Head>
        <Preview>Here&apos;s your Verification code : {otp}</Preview>
        <Section>
            <Row>
                <Heading as="h2" >Hello {username}</Heading>
            </Row>
            <Row>
                <Text>
                    Thank you for registering. please use the following Verification code to complete your registration:
                </Text>
            </Row>
            <Row>
                <Text>{otp}</Text>
            </Row>
            <Row>
                <Text>
                    If you didn't request this code, please ignore this email
                </Text>
            </Row>
            <Row>
                <Text>
                   {`${process.env.DOMAIN}otpVerification?username=${username}`}
                </Text>
            </Row>
        </Section>
    </Html>
}