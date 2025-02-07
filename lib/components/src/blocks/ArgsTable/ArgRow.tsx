import React, { FC } from 'react';
import Markdown from 'markdown-to-jsx';
import { transparentize } from 'polished';
import { styled } from '@storybook/theming';
import { TableArgType, Args, TableAnnotation } from './types';
import { ArgJsDoc } from './ArgJsDoc';
import { ArgValue } from './ArgValue';
import { ArgControl, ArgControlProps } from './ArgControl';
import { codeCommon } from '../../typography/shared';

export interface ArgRowProps {
  row: TableArgType;
  arg: any;
  updateArgs?: (args: Args) => void;
}

const Name = styled.span({ fontWeight: 'bold' });

const Required = styled.span(({ theme }) => ({
  color: theme.color.negative,
  fontFamily: theme.typography.fonts.mono,
  cursor: 'help',
}));

const Description = styled.div(({ theme }) => ({
  '&&': {
    p: {
      margin: '0 0 10px 0',
    },
  },

  code: codeCommon({ theme }),

  '& code': {
    margin: 0,
    display: 'inline-block',
  },
}));

const Type = styled.div<{ hasDescription: boolean }>(({ theme, hasDescription }) => ({
  color:
    theme.base === 'light'
      ? transparentize(0.1, theme.color.defaultText)
      : transparentize(0.2, theme.color.defaultText),
  marginTop: hasDescription ? 4 : 0,
}));

const TypeWithJsDoc = styled.div<{ hasDescription: boolean }>(({ theme, hasDescription }) => ({
  color:
    theme.base === 'light'
      ? transparentize(0.1, theme.color.defaultText)
      : transparentize(0.2, theme.color.defaultText),
  marginTop: hasDescription ? 12 : 0,
  marginBottom: 12,
}));

export const ArgRow: FC<ArgRowProps> = (props) => {
  const { row, arg, updateArgs } = props;
  const { name, description } = row;
  const table = (row.table || {}) as TableAnnotation;
  const type = table.type || row.type;
  const defaultValue = table.defaultValue || row.defaultValue;
  const required = type?.required;
  const hasDescription = description != null && description !== '';

  return (
    <tr>
      <td>
        <Name>{name}</Name>
        {required ? <Required title="Required">*</Required> : null}
      </td>
      <td>
        {hasDescription && (
          <Description>
            <Markdown>{description}</Markdown>
          </Description>
        )}
        {table.jsDocTags != null ? (
          <>
            <TypeWithJsDoc hasDescription={hasDescription}>
              <ArgValue value={type} />
            </TypeWithJsDoc>
            <ArgJsDoc tags={table.jsDocTags} />
          </>
        ) : (
          <Type hasDescription={hasDescription}>
            <ArgValue value={type} />
          </Type>
        )}
      </td>
      <td>
        <ArgValue value={defaultValue} />
      </td>
      {updateArgs ? (
        <td>
          <ArgControl {...(props as ArgControlProps)} />
        </td>
      ) : null}
    </tr>
  );
};
