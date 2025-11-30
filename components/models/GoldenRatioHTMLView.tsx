import React from 'react';
import { GoldenRatioView } from '../htmlviews/GoldenRatioView';

interface Props {
    skipCutscene?: boolean;
}

export const GoldenRatioHTMLView: React.FC<Props> = ({ skipCutscene }) => {
    return <GoldenRatioView />;
};
