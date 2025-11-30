import React from 'react';
import { AntimatterView } from '../htmlviews/AntimatterView';

interface Props {
    skipCutscene?: boolean;
}

export const AntimatterHTMLView: React.FC<Props> = ({ skipCutscene }) => {
    return <AntimatterView />;
};
