import React from 'react';
import { ItemData } from '../../types';
import { MoonItemView } from '../htmlviews/MoonItemView';

interface Props {
    item: ItemData;
    skipCutscene?: boolean; // Added for consistency, though unused
}

export const MoonItemHTMLView: React.FC<Props> = ({ item, skipCutscene }) => {
    return <MoonItemView item={item} />;
};
