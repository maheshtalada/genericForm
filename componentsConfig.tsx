import InputComponent from 'components/genericForm/components/input'
import LabelComponent from 'components/genericForm/components/label'
import SectionComponent from 'components/genericForm/components/section'
import CopyComponent from 'components/genericForm/components/copy'
import RadioComponent from 'components/genericForm/components/radio'
import RadioCardComponent from 'components/genericForm/components/radioCard'
import SelectComponent from 'components/genericForm/components/select'
import DividerComponent from 'components/genericForm/components/divider'
import HeadingComponent from 'components/genericForm/components/heading'
import HtmlContent from 'components/genericForm/components/html-content'
import StatusStepper from 'components/genericForm/components/requestStatus'
import CheckboxComponent from 'components/genericForm/components/checkbox'
// import DateComponent from 'components/genericForm/components/date'
import CalculatorComponent from 'components/genericForm/components/calculator'
import AutoSuggestComponent from 'components/genericForm/components/auto-suggest'
import AutoSuggestAppcode from 'components/genericForm/components/auto-suggest-appcode'
import TextAreaComponent from 'components/genericForm/components/textArea'
import DateTimePickerComponent from 'components/genericForm/components/dateTimePicker'
import CardComponent from 'components/genericForm/components/cardComponent'
// import ListComponent from 'components/genericForm/components/listComponent'
// import DatePickerComponent from 'components/genericForm/components/datePicker'
import CloneComponent from 'components/genericForm/components/clone'
import MultiSelectComponent from 'components/genericForm/components/multiSelect'

export const ComponentsMap = [
    {
        type: "input",
        component: InputComponent,
        schamvalidation: {
            isKeyRequired: true,
            isLabelRequired: true
        }
    },
    {
        type: "label",
        component: LabelComponent,
        schamvalidation: {
            isKeyRequired: true,
            isLabelRequired: true
        }
    },
    {
        type: "heading",
        component: HeadingComponent,
        schamvalidation: {
            isKeyRequired: true
        }
    },
    {
        type: "divider",
        component: DividerComponent,
        schamvalidation: {
            isKeyRequired: false
        }
    },
    {
        type: "copy",
        component: CopyComponent,
        schamvalidation: {
            isKeyRequired: true,
            isLabelRequired: true
        }
    },
    {
        type: "radio",
        component: RadioComponent,
        schamvalidation: {
            isKeyRequired: true,
            isLabelRequired: true,
            isOptionsRequired: true
        }
    },
    {
        type: "radioCard",
        component: RadioCardComponent,
        schamvalidation: {
            isKeyRequired: true,
            isLabelRequired: true
        }
    },
    {
        type: "select",
        component: SelectComponent,
        schamvalidation: {
            isKeyRequired: true,
            isLabelRequired: true,
            isOptionsRequired: true
        }
    },
    {
        type: "multiselect",
        component: MultiSelectComponent,
        schamvalidation: {
            isKeyRequired: true,
            isLabelRequired: true,
            isOptionsRequired: true
        }
    },
    {
        type: "section",
        component: SectionComponent,
        schamvalidation: {
            isKeyRequired: false
        }
    },
    {
        type: "checkbox",
        component: CheckboxComponent,
        schamvalidation: {
            isKeyRequired: true,
            isLabelRequired: true,
            isOptionsRequired: true
        }
    },
    {
        type: "statusStepper",
        component: StatusStepper,
        schamvalidation: {
            isKeyRequired: true
        }
    },
    {
        type: "htmlContent",
        component: HtmlContent,
        schamvalidation: {
            isKeyRequired: false,
            isContentRequired: true
        }
    },
    {
        type: "date",
        component: DateTimePickerComponent,
        schamvalidation: {
            isKeyRequired: true,
            isLabelRequired: true
        }
    },
    {
        type: "calculator",
        component: CalculatorComponent,
        schamvalidation: {
            isKeyRequired: true,
            isLabelRequired: true
        }
    },
    {
        type: "autosuggest",
        component: AutoSuggestComponent,
        schamvalidation: {
        isKeyRequired: true
        }
    },
    {
        type: "autosuggest-appcode",
        component: AutoSuggestAppcode,
        schamvalidation: {
        isKeyRequired: true
        }
    },  
    {
        type: "textarea",
        component: TextAreaComponent,
        schamvalidation: {
            isKeyRequired: true,
            isLabelRequired: true
        }
    },
    {
        type: "hidden",
        component: ()=> null,
        schamvalidation: {
            isKeyRequired: true
        }
    },
    {
        type: "card",
        component: CardComponent,
        schamvalidation: {
            isKeyRequired: true,
            isLabelRequired: true
        }
    },
    {
        type: "clone",
        component: CloneComponent,
        schamvalidation: {
            isKeyRequired: true,
            isLabelRequired: false
        }
    }
]