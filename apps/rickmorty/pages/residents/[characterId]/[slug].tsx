import React from 'react';
import { useRouter } from 'next/router'

const Character = () => {
  const router = useRouter()
  const { characterId, slug } = router.query

  return <div>Location {characterId} {slug}</div>;
};

export function getStaticPaths() {
  return {
    paths: [{ params: { characterId: '1' , slug: 'slug-sss'}}],
    fallback: false
  }
}

export function getStaticProps() {
  // return {
  //   // returns the default 404 page with a status code of 404
  //   notFound: true
  // }

  return { props: { }}
}

export default Character;
