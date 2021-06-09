import React from 'react'
import { Heading } from '@chakra-ui/react';

import { Content } from '@rickmorty/ui/templates';

const ErrorPage = () => {
    return (
        <Content.Full>
            <Heading>Woops... Something went wrong..</Heading>
        </Content.Full>
    )
}

export default ErrorPage
