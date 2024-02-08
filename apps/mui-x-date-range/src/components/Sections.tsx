import {
  Divider,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  SvgIconProps,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { differenceInCalendarMonths } from 'date-fns';
import DefinedRanges from './Sections.DefinedRanges';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import { DuelCalender } from './Sections.DuelCalender';
import { ElementType, useContext, useMemo, useState } from 'react';
import { Footer } from './Sections.Footer';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SingleCalender } from './Sections.SingleCalender';
import {
  DateRange,
  DefinedRange,
  NavigationAction,
  Setter,
} from '../types/utils';
import { DateRangePickerContext } from '../context';

type SectionsProps = {
  dateRange: DateRange;
  ranges: DefinedRange[];
  minDate: Date;
  maxDate: Date;
  firstMonth: Date;
  secondMonth: Date;
  handleSetFirstMonth: (date: Date) => void;
  handleSetSecondMonth: (date: Date) => void;
  handleSetSingleMonth: (date: Date) => void;
  handleClickDefinedRange: Setter<DateRange>;
  helpers: {
    isInHoverRange: (day: Date) => boolean;
  };
  handlers: {
    handleClickDateNumber: (day: Date) => void;
    handleClear: () => void;
    handleHoverDateNumber: (day: Date) => void;
    handleClickNavIcon: (marker: symbol, action: NavigationAction) => void;
  };
  hideClearButton?: boolean;
  hideDefaultRanges?: boolean;
  hideOutsideMonthDays?: boolean;
  RangeSeparatorIcons?: {
    xs?: ElementType<SvgIconProps>;
    md?: ElementType<SvgIconProps>;
  };
  onCloseCallback?: () => void;
  footerRequired?: boolean;
};

const Sections = (props: SectionsProps) => {
  const dateContext = useContext(DateRangePickerContext);
  const theme = useTheme();
  const {
    dateRange,
    ranges,
    minDate,
    maxDate,
    firstMonth,
    secondMonth,
    handleSetFirstMonth,
    handleSetSecondMonth,
    handleSetSingleMonth,
    handleClickDefinedRange,
    helpers,
    handlers,

    hideClearButton = false,
    hideDefaultRanges = false,
    hideOutsideMonthDays,
    RangeSeparatorIcons,
    onCloseCallback,
    footerRequired,
  } = props;

  const { startDate, endDate } = dateRange;
  const canNavigateCloser =
    differenceInCalendarMonths(secondMonth, firstMonth) >= 2;
  const commonProps = {
    dateRange,
    minDate,
    maxDate,
    helpers,
    handlers,
  };

  const [selectedRange, setSelectedRange] = useState('');
  const [selectedRangeObj, setSelectedRangeObj] = useState<
    DefinedRange | undefined
  >(undefined);

  const onChangeSelectedRange = (e: SelectChangeEvent<string>) => {
    const selectedRange = ranges.find(
      (range) => range.label === e.target.value
    );

    if (selectedRange) {
      setSelectedRange(selectedRange.label);
      setSelectedRangeObj(selectedRange); //to use in this component
      handleClickDefinedRange(selectedRange); // to global state
    }
  };

  const isRangeSameDay = (
    sd1: Date,
    ed1: Date,
    sd2: Date,
    ed2: Date
  ): boolean => {
    return (
      sd1.getDate() === sd2.getDate() &&
      sd1.getMonth() === sd2.getMonth() &&
      sd1.getFullYear() === sd2.getFullYear() &&
      ed1.getDate() === ed2.getDate() &&
      ed1.getMonth() === ed2.getMonth() &&
      ed1.getFullYear() === ed2.getFullYear()
    );
  };

  useMemo(() => {
    if (selectedRangeObj && dateRange.startDate && dateRange.endDate) {
      const { startDate: sd1, endDate: ed1 } = dateRange;
      const { startDate: sd2, endDate: ed2 } = selectedRangeObj;

      if (sd1 && ed1 && sd2 && ed2) {
        if (isRangeSameDay(sd1, ed1, sd2, ed2)) {
          return;
        }
        setSelectedRange('');
      }
    }
  }, [selectedRangeObj, dateRange]);

  return (
    <Grid2
      container
      sx={{
        borderRadius: '16px',
      }}
    >
      <Grid2
        xs="auto"
        container
        direction={'column'}
        className="DRP-Defined-Ranges"
        display={{ xs: 'none', md: hideDefaultRanges ? 'none' : 'flex' }}
      >
        {/* Defined Ranges Selection ( MD+ ) */}
        <DefinedRanges
          selectedRange={dateRange}
          ranges={ranges}
          setRange={handleClickDefinedRange}
        />
      </Grid2>

      {/* Divider for Defined Ranges ( MD+ )*/}
      <Grid2
        xs="auto"
        display={{ xs: 'none', md: hideDefaultRanges ? 'none' : 'block' }}
      >
        <Divider orientation="vertical" />
      </Grid2>

      <Grid2 xs container direction={'column'}>
        {/* Defined Ranges Selection ( MD- ) */}
        <Grid2
          display={{ xs: hideDefaultRanges ? 'none' : 'flex', md: 'none' }}
          container
          height="54px"
          alignItems={'center'}
          px="10px"
          sx={{ backgroundColor: alpha(theme.palette.grey[400], 0.1) }}
        >
          <Grid2
            xs={12}
            container
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography variant="body2">{dateContext.locale.texts.selectors.quickSelect}</Typography>

            <FormControl>
              <Select
                displayEmpty
                SelectDisplayProps={{
                  style: {
                    minHeight: 'unset',
                  },
                }}
                variant="outlined"
                size="small"
                IconComponent={(props) => (
                  <KeyboardArrowDownIcon
                    fontSize="small"
                    sx={{
                      fill: theme.palette.grey[400],
                    }}
                    {...props}
                  />
                )}
                slotProps={{
                  root: {
                    sx: {
                      height: '30px',
                      backgroundColor: '#fff',
                    },
                  },
                }}
                MenuProps={{
                  disablePortal: true,
                  PaperProps: {
                    sx: {
                      width: 'auto',
                      maxHeight: '224px',
                      boxShadow:
                        'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
                    },
                  },
                }}
                value={selectedRange}
                onChange={onChangeSelectedRange}
              >
                {ranges.map((range) => {
                  return (
                    <MenuItem key={range.label} value={range.label}>
                      <Typography variant="body2">{range.label}</Typography>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid2>
        </Grid2>

        {/* Divider for Defined Ranges ( MD- )*/}
        <Grid2 display={{ xs: 'block', md: 'none' }}>
          <Divider />
        </Grid2>

        {/* Dual Calender ( MD- ) */}
        <Grid2 container display={{ xs: 'flex', md: 'none' }}>
          <SingleCalender
            firstMonth={firstMonth}
            secondMonth={secondMonth}
            handleSetSingleMonth={handleSetSingleMonth}
            canNavigateCloser={canNavigateCloser}
            commonProps={commonProps}
            hideOutsideMonthDays={hideOutsideMonthDays}
          />
        </Grid2>

        {/* Dual Calender ( MD+ ) */}
        <Grid2 flex={1} display={{ xs: 'none', md: 'flex' }} container>
          <DuelCalender
            firstMonth={firstMonth}
            secondMonth={secondMonth}
            handleSetFirstMonth={handleSetFirstMonth}
            handleSetSecondMonth={handleSetSecondMonth}
            canNavigateCloser={canNavigateCloser}
            commonProps={commonProps}
            hideOutsideMonthDays={hideOutsideMonthDays}
          />
        </Grid2>

        {/* Footer With Divider Section (ALL) */}
        {footerRequired ? (
          <>
            {/* Divider for Footer ( All )*/}
            <Grid2 display={'block'}>
              <Divider />
            </Grid2>

            {/* Footer Section (ALL) */}
            <Grid2
              display={'flex'}
              xs="auto"
              container
              alignItems={{
                xs: 'normal',
                md: 'center',
              }}
              justifyContent={{
                xs: 'center',
                md: 'flex-end',
              }}
              direction={{
                xs: 'column',
                md: 'row',
              }}
              p="16px"
              gap={2}
            >
              <Footer
                startDate={startDate}
                endDate={endDate}
                hideClearButton={hideClearButton}
                onCloseCallback={onCloseCallback}
                onClear={handlers.handleClear}
                RangeSeparatorIcons={RangeSeparatorIcons}
              />
            </Grid2>
          </>
        ) : null}
      </Grid2>
    </Grid2>
  );
};

export default Sections;
