import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';
import { useViewer } from 'hooks/useViewer';
import CloseIcon from 'svg/CloseIcon';
import Trash from 'svg/TrashOutline';
import { ButtonText } from 'components/Button';
import { Button } from 'components/Button/Button';
import classNames from 'styles/utils/classNames';
import Header from './Header';
import {
  GroupsFormData,
  PropsSetRegistrationFormData,
  RegisterProps,
  Steps,
  groupsFormSchema,
} from './types';

interface Props extends RegisterProps, PropsSetRegistrationFormData {
  invitationGroupId?: string | null;
  invitationTeamMembers?: { groupId: string; name: string; id: string }[] | null;
  isIgnoreInvitation?: boolean;
  setIsIgnoreInvitation: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddEvents({
  setSteps,
  event,
  handleNext,
  setRegistrationFormData,
  invitationGroupId,
  invitationTeamMembers,
  isIgnoreInvitation,
  setIsIgnoreInvitation,
}: Props) {
  const { control, formState, watch, handleSubmit } = useForm<GroupsFormData>({
    resolver: zodResolver(groupsFormSchema),
    defaultValues: {
      groups: [{ groupId: invitationGroupId || '', partnerEmail: '', partnerName: '' }],
    },
  });
  const { isAnonymousSession } = useViewer();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'groups',
  });

  const watchedGroups = watch('groups');
  const isGroupsLimit = watchedGroups.length >= event.groups.length;
  const totalPrice =
    event.registrationPriceUnitAmount +
    watchedGroups.reduce((acc: number, group: { groupId: string }) => {
      const matchingGroup = event.groups.find((g) => g.id === group.groupId);
      return acc + (matchingGroup?.priceUnitAmount || 0);
    }, 0);
  const groupedIdsUsed = watchedGroups.map((group: { groupId: string }) => group.groupId);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        setRegistrationFormData((prev) => ({ ...prev, groups: data.groups }));
        handleNext();
      })}
      className="tournament-register-form flex h-full flex-col items-start"
    >
      <div className="flex h-full w-full flex-auto flex-col overflow-y-auto px-6 pb-8 pt-6">
        <Header title="Register" cta="Event and partner selection" />
        <div className="mt-8">
          <div className="flex justify-between">
            <h2 className="typography-product-body-highlight text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              Registration fee
            </h2>
            <p className="typography-product-body-highlight text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              {convertUnitPriceToFormattedPrice(event.registrationPriceUnitAmount).priceDisplay}
            </p>
          </div>
          {fields.map((field, index) => {
            const selectedGroup = watchedGroups[index];
            const matchingGroup = event.groups.find((group) => group.id === selectedGroup?.groupId);
            const groupIdsToRemove = groupedIdsUsed.filter(
              (id: string) => id !== selectedGroup?.groupId,
            );
            const options = event.groups.filter((group) => !groupIdsToRemove.includes(group.id));
            const errorForEvent = formState.errors?.groups?.[index];
            const teamMembersForGroupInvitation =
              invitationTeamMembers?.filter((tm) => tm.groupId === selectedGroup?.groupId) || [];

            return (
              <div key={field.id} className="mt-6 flex flex-col gap-4">
                <div className="flex justify-between">
                  <h2 className="typography-product-body-highlight text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                    Event #{index + 1}
                  </h2>
                  <div className="flex items-center">
                    {!!matchingGroup && (
                      <p className="typography-product-body-highlight text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                        {
                          convertUnitPriceToFormattedPrice(matchingGroup.priceUnitAmount)
                            .priceDisplay
                        }
                      </p>
                    )}
                    {watchedGroups.length > 1 && (
                      <div className="ml-4">
                        <ButtonText onClick={() => remove(index)}>
                          <Trash className="h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />
                        </ButtonText>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div>
                    <Controller
                      name={`groups.${index}.groupId`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          required
                          className={classNames(
                            'input-form cursor-pointer',
                            matchingGroup
                              ? 'text-color-text-lightmode-primary dark:text-color-text-darkmode-primary'
                              : 'text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder',
                          )}
                        >
                          <option value="" disabled>
                            Event
                          </option>
                          {options.map((group) => (
                            <option key={group.id} value={group.id} className="cursor-pointer">
                              {group.title}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                  {!teamMembersForGroupInvitation?.length || isIgnoreInvitation ? (
                    <div className="mt-3">
                      <Controller
                        render={({ field }) => (
                          <input
                            {...field}
                            className={classNames(
                              'input-form',
                              !!errorForEvent?.partnerEmail &&
                                'text-color-text-lightmode-error dark:text-color-text-darkmode-error',
                            )}
                            placeholder="Partner email"
                            type="email"
                            required
                          />
                        )}
                        name={`groups.${index}.partnerEmail`}
                        control={control}
                      />
                      {!!errorForEvent?.partnerEmail && (
                        <p className="typography-product-text-card mt-2 text-color-text-lightmode-error dark:text-color-text-darkmode-error">
                          {errorForEvent.partnerEmail.message}
                        </p>
                      )}
                      <p className="typography-product-text-card mt-2 text-color-text-lightmode-tertiary dark:text-color-text-lightmode-tertiary">
                        You must have a partner to register. Please include their email address and
                        we'll confirm their participation.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <div>
                        <div>
                          <span className="typography-product-element-label">Team members:</span>{' '}
                          <span className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                            {teamMembersForGroupInvitation.map(({ name }) => name).join(', ')}
                          </span>
                        </div>
                      </div>
                      <div className="typography-product-text-card mt-0.5">
                        <ButtonText
                          className="flex items-center"
                          onClick={() => setIsIgnoreInvitation(true)}
                        >
                          <CloseIcon className="mr-0.5 h-3.5 w-3.5 text-color-brand-primary" />{' '}
                          <span className="text-color-text-lightmode-secondary dark:text-color-text-lightmode-secondary">
                            Choose different team
                          </span>
                        </ButtonText>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {!isGroupsLimit && (
            <div className="mt-6 flex items-start">
              <ButtonText
                onClick={() => append({ groupId: '', partnerEmail: '', partnerName: '' })}
                className="typography-product-button-label-medium text-color-text-brand dark:text-color-text-brand"
              >
                + Add event
              </ButtonText>
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-between">
          <p className="text-color-text-lightmode-primay typography-product-body-highlight dark:text-color-text-darkmode-primary">
            Total
          </p>
          <p className="typography-product-body-highlight text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            {convertUnitPriceToFormattedPrice(totalPrice).priceDisplay}
          </p>
        </div>
      </div>
      <div className={classNames('w-full px-6', !isAnonymousSession && 'pb-6')}>
        <Button type="submit" variant="brand" size="lg">
          Next
        </Button>
      </div>
      {isAnonymousSession && (
        <div className="typography-product-caption mt-6 w-full px-6 pb-6 text-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          Already registered?{' '}
          <ButtonText
            className="font-medium text-color-brand-primary"
            onClick={() => setSteps(Steps.Login)}
          >
            Login
          </ButtonText>
        </div>
      )}
    </form>
  );
}
