import React from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import OutlinedInput from '@mui/material/OutlinedInput'
import LabelTitleComponent from './label-title'
import { type FieldProps } from '../FormField'
import { findIndex } from 'lodash'
import { setXS, trimString } from '../hooks/useDependableRules'
import { getReadOnlyState } from '../hooks/useBaseField'
import Chip from '@mui/material/Chip'
import { ReactComponent as ClearIcon } from 'assets/closeimage.svg'
import { ReactComponent as ArrowDown } from 'assets/accordionDown.svg'

const MultiSelectComponent = (props: FieldProps): any => {
    const { data, placeholder, onChange, options, dataKey, xs, children, error, config } = props
    const items = options.map(option => ({ name: option.label, num: option.value }))
    const readOnly = getReadOnlyState(props)

      const getSelectedItems = () => {
        if (data && typeof data === 'string') {
          const selectedItem = findIndex(items, { num: String(data) })
          return items?.[selectedItem] ? [items[selectedItem]] : []
        } else if (data && Array.isArray(data) && data.length > 0) {
          const selectedItems: any = []
          data.forEach((item: any) => {
            const selectedItemIndex = findIndex(items, { num: String(item) })
            if (items?.[selectedItemIndex]) {
              selectedItems.push(items[selectedItemIndex])
            }
          })
          if (selectedItems?.length === 0) {
            return []
          }
          return selectedItems
        } else {
          return []
        }
      }

    const handleChange = (event: any) => {
        const {
            target: { value }
        } = event
        if (Array.isArray(value) && value.length > 0) {
            onChange(value.map((i: any) => i.num), dataKey)
        } else {
            onChange('', dataKey)
        }
    }

    const handleRemoveFilter = (tag: string) => {
        if (tag) {
            const selectedValues: any[] = getSelectedItems().map((item: any) => item)
            const index = selectedValues.findIndex(val => (val.name === tag))
            if (index !== -1) {
                selectedValues.splice(index, 1)
                if (selectedValues.length > 0) {
                    const selectedValuesNums = selectedValues.map((i: any) => i.num)
                    onChange([...selectedValuesNums], dataKey)
                } else {
                    onChange('', dataKey)
                }
            }
        }
    }

    const ChipWrapper = (tagProps: any) => {
        const { index, tag } = tagProps
        const [isExpanded, setExpanded] = React.useState<boolean>(false)

        const handleDelete = (event: any) => {
            event.stopPropagation()
            handleRemoveFilter(tag)
        }

        return (
            <Chip
                {...tagProps}
                key={index}
                label={tag}
                deleteIcon={<ClearIcon />}
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
                sx={{
                    transition: 'all 0.5s ease',
                    borderRadius: '8px',
                    background: '#BCDFFD',
                    maxWidth: '100%',
                    fontFamily: 'Nunito Sans',
                    color: '#000',
                    padding: '5px 0',
                    height: 'auto',
                    fontSize: '13px',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    lineHeight: '16px',
                    marginRight: '5px',
                    '.MuiChip-label': {
                        whiteSpace: isExpanded ? 'normal' : 'nowrap',
                        maxWidth: isExpanded ? '97%' : '280px',
                    },
                    '.MuiChip-deleteIcon': {
                        margin: '0 6px 0 -3px'
                    },
                }}
                onDelete={handleDelete}
            onMouseDown={(event) => event.stopPropagation()} />
        )
    }

    return (
        <Grid item xs={setXS(xs, children)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '11px', marginTop: '1rem' }}>
            <LabelTitleComponent {...props} />
            <Select
                multiple
                className='w-40 schema__select'
                value={getSelectedItems()}
                onChange={handleChange}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <Typography sx={{ color: '#A5A7AC',
                      fontSize: '16px',
                      fontWeight: '300',
                      fontFamily: 'Nunito Sans, sans-serif',
                       }}>{typeof placeholder !== 'undefined' && trimString(placeholder) ? trimString(placeholder) : 'Select option'}</Typography>
                    }
                    return (
                      <Grid className={config?.isHorizontalScroll && 'enable-horizontal-scroll-tags'} item xs={12} sx={{ margin: '10px 20px 10px 0', maxWidth: '95% !important', overflowX: 'auto' }}>
                        {selected.map((option: any | null, index: number) => (
                          <ChipWrapper key={String(index) + '-tag'} tag={option?.name} index={index}
                           value={option?.name} />
                        ))}
                      </Grid>
                )}
            }
                IconComponent={ArrowDown}
                error={!!error}
                displayEmpty
            >
                {items.map((item, idx) => (
                    <MenuItem key={idx} value={item} disabled={item.num < 0}>
                        {item.name}
                    </MenuItem>
                ))}
            </Select>
            {error && (
                <Typography component="span" sx={{
                    color: '#FF5E48',
                    fontSize: '12px',
                    fontWeight: '600',
                    fontFamily: 'Nunito Sans, sans-serif',
                    lineHeight: 'normal',
                    margin: '0 5px',
                    width: 'auto',
                    textTransform: 'capitalize'
                }}>
                    {error}
                </Typography>
            )}
        </Grid>
    )
}

export default MultiSelectComponent