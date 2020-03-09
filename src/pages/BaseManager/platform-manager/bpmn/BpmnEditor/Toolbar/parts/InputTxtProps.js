import entryFactory from 'cus-/lib/factory/EntryFactory';

export default function(group, element, bpmnFactory, translate) {
    group.entries.push(
        entryFactory.textField({
            id: 'customTxt',
            label: translate('自定义输入框'),
            modelProperty: 'camunda:customTxt',
        })
    );
}
