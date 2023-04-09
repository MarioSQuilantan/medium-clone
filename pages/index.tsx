import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Spacer, Text } from '@nextui-org/react'

const Home: NextPage = () => {
  return (
   <>
    <Text h2>The future of article sharing</Text>
    <Spacer y={1}></Spacer>
    <Text size={'$lg'}>ShareArticles allows you to create and  share articles.</Text>
   </>
  )
}

export default Home
