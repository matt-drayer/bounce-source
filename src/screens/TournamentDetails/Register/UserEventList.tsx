import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { getEventUrl } from 'constants/pages';
import {
  EventGroupRegistrationStatusesEnum,
  EventInvitationStatusesEnum,
  EventTeamMemberStatusesEnum,
  GetUserEventRegistrationQuery,
  TeamTypesEnum,
} from 'types/generated/client';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';
import { useViewer } from 'hooks/useViewer';
import CloseIcon from 'svg/CloseIcon';
import Share from 'svg/Share';
import Trash from 'svg/TrashOutline';
import { Button } from 'components/Button';
import { ButtonText } from 'components/Button';
import ModalShare from 'components/modals/ModalShare';
import classNames from 'styles/utils/classNames';
import Header from './Header';
import {
  GroupsFormData,
  PropsSetRegistrationFormData,
  RegisterProps,
  groupsFormSchema,
} from './types';

const IS_PHONE_ENABLED = false;

interface Props extends RegisterProps, PropsSetRegistrationFormData {
  name?: string;
  hasPreviousEventRegistration: boolean;
  hasPreviousGroupRegistration: boolean;
  invitationGroupId?: string | null;
  invitationTeamMembers?: { groupId: string; name: string; id: string }[] | null;
  isIgnoreInvitation?: boolean;
  setIsIgnoreInvitation: React.Dispatch<React.SetStateAction<boolean>>;
}

enum StatusEnum {
  Pending = 'PENDING',
  Registered = 'REGISTERED',
}

const Status = ({ status }: { status: StatusEnum }) => {
  let text = '';
  if (status === StatusEnum.Pending) {
    text = 'Pending';
  } else if (status === StatusEnum.Registered) {
    text = 'Registered';
  }

  return (
    <div
      className={classNames(
        'rounded-xl px-3 py-1 text-sm font-medium leading-4',
        status === StatusEnum.Pending && 'bg-brand-yellow-100 text-brand-yellow-600',
        status === StatusEnum.Registered && 'bg-brand-green-100 text-brand-green-500',
      )}
    >
      {text}
    </div>
  );
};

interface DescriptionTextParams {
  hasPreviousEventRegistration: boolean;
  hasPreviousGroupRegistration: boolean;
  eventGroupRegistrations: GetUserEventRegistrationQuery['eventGroupRegistrations'];
}

const getDescriptionText = ({
  hasPreviousEventRegistration,
  hasPreviousGroupRegistration,
  eventGroupRegistrations,
}: DescriptionTextParams) => {
  if (hasPreviousEventRegistration && !hasPreviousGroupRegistration) {
    return 'You have registered for the tournament but no events. Add events below.';
  }

  const hasMissingPartner = eventGroupRegistrations.some((egr) => {
    const teamMembers = egr.group.teams.flatMap((team) => team.members);
    return egr.group.teamType === TeamTypesEnum.Doubles && teamMembers.length === 1;
  });

  if (hasMissingPartner) {
    return 'You have successfully registered for the tournament, but we are waiting for your partner to register.';
  } else {
    return 'You and your partner are registered for the tournament!';
  }
};

export default function UserEventList({
  event,
  name = '',
  registrations,
  setRegistrationFormData,
  handleNext,
  hasPreviousEventRegistration,
  hasPreviousGroupRegistration,
  invitationGroupId,
  invitationTeamMembers,
  isIgnoreInvitation,
  setIsIgnoreInvitation,
}: Props) {
  const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);
  const { userId } = useViewer();
  const { control, formState, watch, handleSubmit } = useForm<GroupsFormData>({
    resolver: zodResolver(groupsFormSchema),
    defaultValues: {
      groups: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'groups',
  });
  const existingEventCount = registrations?.eventGroupRegistrations.length || 0;
  const watchedGroups = watch('groups');
  const isGroupsLimit = watchedGroups.length + existingEventCount >= event.groups.length;
  const groupedIdsUsed: string[] = [
    ...watchedGroups.map((group: { groupId: string }) => group.groupId),
    ...(registrations?.eventGroupRegistrations || []).map((gr) => gr.group.id).filter((id) => !!id),
  ];

  React.useEffect(() => {
    if (hasPreviousEventRegistration && !hasPreviousGroupRegistration) {
      append({ groupId: '', partnerEmail: '', partnerName: '' });
    }
  }, [hasPreviousEventRegistration, hasPreviousGroupRegistration]);

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          setRegistrationFormData((prev) => ({ ...prev, groups: data.groups }));
          handleNext();
        })}
        className="tournament-register-form flex h-full flex-col items-start"
      >
        <div className="flex h-full w-full flex-auto flex-col overflow-y-auto px-6 pb-8 pt-6">
          <Header title={`Welcome ${name}`.trim()} />
          <div className="typography-product-body mt-8 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            {getDescriptionText({
              hasPreviousEventRegistration,
              hasPreviousGroupRegistration,
              eventGroupRegistrations: registrations?.eventGroupRegistrations || [],
            })}
          </div>
          {IS_PHONE_ENABLED && (
            <div className="mt-8 border-t border-color-border-input-lightmode pt-8 dark:border-color-border-input-darkmode">
              <p className="typography-product-body text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Add your phone number to get live updates during the tournament
              </p>
              <div className="mt-2">
                <input placeholder="Phone number" className="input-form" />
              </div>
            </div>
          )}
          <div>
            {registrations?.eventGroupRegistrations.map((gr, i) => {
              let teamMembers: (typeof gr.group.teams)[0]['members'] = [];
              gr.group.teams.forEach((team) => {
                teamMembers = [...teamMembers, ...team.members];
              });
              teamMembers = teamMembers.filter((t) => t.userId !== userId);
              const teamMemberIds = teamMembers.map((t) => t.userId);

              return (
                <div
                  key={gr.id}
                  className="mt-8 border-t border-color-border-input-lightmode pt-8 dark:border-color-border-input-darkmode"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="typography-product-subheading truncate">
                        {gr.group.title || `Event #${i + 1}`}
                      </h3>
                    </div>
                    {!teamMembers.length && (
                      <ButtonText
                        className="typography-product-subheading ml-2 flex shrink-0 items-center whitespace-nowrap pr-2 text-color-brand-primary"
                        onClick={() => {
                          const teamId = gr.group.teams.find(
                            (team) => team.members.length >= 1,
                          )?.id;
                          const invitationId = gr.invitations.filter(
                            (invite) => invite.status !== EventInvitationStatusesEnum.Accepted,
                          )?.[0]?.id;
                          let shareUrl = `${process.env.ROOT_URL}${getEventUrl(event.id)}`;
                          let queryStringItems = [];

                          if (teamId) {
                            queryStringItems.push(`team=${teamId}`);
                          }
                          if (invitationId) {
                            queryStringItems.push(`invite=${invitationId}`);
                          }
                          if (queryStringItems) {
                            shareUrl += `?${queryStringItems.join('&')}`;
                          }

                          setShareData({
                            title: `Share ${gr.group.title || 'Event'}`,
                            url: shareUrl,
                          });

                          if (navigator.share) {
                            const shareText = `Pickleball tournament on Bounce${
                              gr.group.title ? ` - ${gr.group.title}` : ''
                            }${event.title ? ` - ${event.title}` : ''}. Join me!`;

                            navigator
                              .share({
                                title: shareText,
                                text: shareText,
                                url: shareUrl,
                              })
                              .then(() => console.log('Successful share'))
                              .catch((error) => console.log('Error sharing:', error));
                          }
                        }}
                      >
                        <Share className="mr-1 h-4 w-4" /> Invite
                      </ButtonText>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="mt-6 flex items-center justify-between">
                      <div className="typography-product-body-highlight text-ellipsis">
                        {name || 'You'}
                      </div>
                      <Status
                        status={
                          gr.status === EventGroupRegistrationStatusesEnum.Active
                            ? StatusEnum.Registered
                            : StatusEnum.Pending
                        }
                      />
                    </div>
                    {teamMembers.map((team) => {
                      return (
                        <div key={team.id} className="mt-6 flex items-center justify-between">
                          <div className="typography-product-body-highlight text-ellipsis">
                            {team.userProfile?.fullName || 'Partner'}
                          </div>
                          <Status
                            status={
                              team.status === EventTeamMemberStatusesEnum.Active
                                ? StatusEnum.Registered
                                : StatusEnum.Pending
                            }
                          />
                        </div>
                      );
                    })}
                    {teamMembers.length > 0
                      ? null
                      : gr.invitations
                          /**
                           * @note once accepted, they should be on the team and can be filtered out
                           */
                          .filter(
                            (invite) => invite.status !== EventInvitationStatusesEnum.Accepted,
                          )
                          .map((invite) => {
                            return (
                              <div
                                key={invite.id}
                                className="mt-6 flex items-center justify-between"
                              >
                                <div className="typography-product-body-highlight text-ellipsis">
                                  {invite.invitationEmail}
                                </div>
                                <Status
                                  status={
                                    invite.status === EventInvitationStatusesEnum.Accepted
                                      ? StatusEnum.Registered
                                      : StatusEnum.Pending
                                  }
                                />
                              </div>
                            );
                          })}
                  </div>
                </div>
              );
            })}
          </div>
          {(fields || []).map((field, index) => {
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
                    Event #{index + existingEventCount + 1}
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
            <div className="mt-8 flex items-start">
              <ButtonText
                onClick={() => {
                  append({ groupId: '', partnerEmail: '', partnerName: '' });
                }}
                className="typography-product-button-label-medium text-color-text-brand dark:text-color-text-brand"
              >
                + Add event
              </ButtonText>
            </div>
          )}
        </div>
        <div
          className={classNames('w-full px-6 pb-6', watchedGroups.length > 0 ? 'block' : 'hidden')}
        >
          <Button type="submit" variant="brand" size="lg">
            Next
          </Button>
        </div>
      </form>
      <ModalShare
        closeModal={() => setShareData(null)}
        isOpen={!!shareData}
        shareUrl={shareData?.url || ''}
        title={shareData?.title || ''}
      />
    </>
  );
}
