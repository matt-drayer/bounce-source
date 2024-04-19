alter table "public"."skill_levels" drop constraint "skill_levels_rank_check";
alter table "public"."skill_levels" add constraint "skill_levels_rank_check" check (CHECK (rank >= 0));
