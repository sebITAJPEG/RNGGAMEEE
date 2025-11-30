import React from 'react';
import { StrangeMatterView } from '../htmlviews/StrangeMatterView';

interface Props {
    skipCutscene?: boolean;
}

export const StrangeMatterHTMLView: React.FC<Props> = ({ skipCutscene }) => {
    return <StrangeMatterView />;
};
