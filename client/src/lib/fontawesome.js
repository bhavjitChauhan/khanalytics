import { library } from '@fortawesome/fontawesome-svg-core';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import {
    faAngleDown,
    faAngleDoubleDown,
    faAngleDoubleUp,
    faAngleUp,
    faBars,
    faEquals,
    faHistory,
    faInfo
} from '@fortawesome/free-solid-svg-icons';


library.add(
    faAngleDown,
    faAngleDoubleDown,
    faAngleDoubleUp,
    faAngleUp,
    faBars,
    faEquals,
    faHistory,
    faInfo
);
library.add(faQuestionCircle);


export default library;
