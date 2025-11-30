import React from 'react';
import { NeutroniumView } from '../htmlviews/NeutroniumView';

interface Props {
    skipCutscene?: boolean;
}

export const NeutroniumHTMLView: React.FC<Props> = ({ skipCutscene }) => {
    return <NeutroniumView />;
};
