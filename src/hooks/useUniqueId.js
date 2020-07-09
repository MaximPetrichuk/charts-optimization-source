import uniqueId from 'lodash/uniqueId';
import { useMemo } from 'react';

/**
 * returns constant during component lifetime unique id
 * @returns {string}
 */
export const useUniqueId = () => useMemo(() => `${uniqueId()}`, []);
