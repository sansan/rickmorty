import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { HStack, Select } from '@chakra-ui/react';

const getQueryPath = ({ type, dimension }) => {
  const params = [];

  if (!type && !dimension) {
    return '';
  }

  if (type) {
    params.push(`type=${type}`);
  }

  if (dimension) {
    params.push(`dimension=${dimension}`);
  }

  if (params.length > 0) {
    return `?${params.join('&')}`;
  }
};

export const Filter = ({ dimensions, types }) => {
  const router = useRouter();
  const { dimension, type } = router.query;

  if (dimension && !dimensions.some(({ slug }) => slug === dimension)) {
    router.push('/404');
  }

  if (type && !types.some(({ slug }) => slug === type)) {
    router.push('/404');
  }

  const handleApplyDimensions = (dimension) =>
    router.push(getQueryPath({ type, dimension }));

  const handleApplyType = (type) =>
    router.push(getQueryPath({ type, dimension }));

  return (
    <HStack>
      <Select
        placeholder="Filter by dimension"
        onChange={(e) => handleApplyDimensions(e.target.value)}
        maxW="350px"
        value={dimension}
      >
        {dimensions.map(({ name, slug }) => (
          <option key={slug} value={slug}>
            {name}
          </option>
        ))}
      </Select>

      <Select
        placeholder="Filter by type"
        onChange={(e) => handleApplyType(e.target.value)}
        maxW="350px"
        value={type}
      >
        {types.map(({ name, slug }) => (
          <option key={slug} value={slug}>
            {name}
          </option>
        ))}
      </Select>
    </HStack>
  );
};

export default Filter;
