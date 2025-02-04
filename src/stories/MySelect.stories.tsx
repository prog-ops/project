import {Meta, StoryObj,} from '@storybook/react';
import { fn } from '@storybook/test';
import MySelect from "../components/MySelect.tsx";
import {options} from "../App.tsx";
import {ComponentProps, useState} from "react";

interface Option {
    label: string;
    value: number;
}

type StoryProps = ComponentProps<typeof MySelect> & {
    withSearch?: boolean;
    multiple?: boolean;
    outlined?: boolean;
};

const meta: Meta<StoryProps> = {
    component: MySelect,
    tags: ['autodocs'],
    argTypes: {
        options: {
            control: { type: 'object' },
        },
        onSelect: {
            action: 'selected',
        },
        withSearch: {
            control: { type: 'boolean' },
        },
        multiple: {
            control: { type: 'boolean' },
        },
        outlined: {
            control: { type: 'boolean' },
        },
        searchable: {
            control: { type: 'boolean' },
        },
        zIndex: {
            control: { type: 'number' },
        },
    },
};

export default meta;


const Template: React.FC<StoryProps> = (args) => {
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

    const handleSelect = (selected: Option[]) => {
        setSelectedOptions(selected);
        args.onSelect(selected);
    };

    return (
        <MySelect
            {...args}
            options={args.options}
            onSelect={handleSelect}
            searchable={args.withSearch}
            zIndex={args.zIndex}
        />
    );
};


type Story = StoryObj<StoryProps>;


// Default story
export const Default: Story = {
    render: (args) => <Template {...args} />,
    args: {
        options: options,
        onSelect: fn(),
        withSearch: true,
        multiple: true,
        outlined: true,
        zIndex: 1001,
    },
};

// Story with no searchable option
export const NonSearchable: Story = {
    render: (args) => <Template {...args} />,
    args: {
        options: options,
        onSelect: fn(),
        withSearch: false,
        multiple: true,
        outlined: true,
        zIndex: 1001,
    },
};

// Story with single selection
export const SingleSelection: Story = {
    render: (args) => <Template {...args} />,
    args: {
        options: options,
        onSelect: fn(),
        withSearch: true,
        multiple: false,
        outlined: true,
        zIndex: 1001,
    },
};

// Story with no outline
export const NonOutlined: Story = {
    render: (args) => <Template {...args} />,
    args: {
        options: options,
        onSelect: fn(),
        withSearch: true,
        multiple: true,
        outlined: false,
        zIndex: 1001,
    },
};
