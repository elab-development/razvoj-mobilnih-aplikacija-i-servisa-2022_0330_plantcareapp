import { StyleSheet } from "react-native";

import { Fonts } from "@/constants/fonts";
import { LogoStyle } from "@/constants/logo";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { fontScale, hp, moderateScale, wp } from "@/utils/responsive";
const colors = Colors.light as any;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  topShape: {
    position: "absolute",
    top: -hp(17),
    left: -wp(12),
    width: wp(125),
    height: hp(30),
    backgroundColor: colors.accent,
    marginBottom: hp(2),
  },
  listContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(6),
    paddingBottom: hp(16),
  },

  logo: {
    ...LogoStyle,
  },

  title: {
    ...Typography.screenTitle,
    color: colors.textLightest,
    textAlign: "center",
    marginBottom: hp(3),
  },

  calendarCard: {
    width: "100%",
    backgroundColor: colors.pureWhite ?? "#FFFFFF",
    borderRadius: moderateScale(14),
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.2),
    marginBottom: hp(3),

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 4,
  },

  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(2),
  },

  monthBox: {
    width: wp(30),
    height: hp(4),
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: moderateScale(8),
    justifyContent: "center",
    paddingHorizontal: wp(2),
  },

  yearBox: {
    width: wp(30),
    height: hp(4),
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: moderateScale(8),
    justifyContent: "center",
    paddingHorizontal: wp(2),
  },

  monthText: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(15),
    color: colors.textDarkest,
  },

  weekRow: {
    flexDirection: "row",
    marginBottom: hp(1),
  },

  weekDay: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(12),
    color: "#777777",
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayCell: {
    width: `${100 / 7}%`,
    height: hp(4.8),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(8),
  },

  selectedDayCell: {
    backgroundColor: "#303030",
  },

  taskDayCell: {
    backgroundColor: "#EEEEEE",
  },

  dayText: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(16),
    color: "#222222",
  },

  selectedDayText: {
    color: "#FFFFFF",
  },

  inactiveDayText: {
    color: "#BBBBBB",
  },

  todayTitle: {
    ...Typography.sectionTitle,
    color: colors.textLightest,

    textShadowColor: "rgba(20, 44, 25, 0.45)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 2,
  },

  dateText: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(18),
    color: colors.mediumgreen,
    marginBottom: hp(2),

    textShadowColor: colors.textDarkest,
    textShadowOffset: { width: 0, height: 0.4 },
    textShadowRadius: 1,
  },

  taskCard: {
    width: "100%",
    minHeight: hp(9.5),
    backgroundColor: colors.white,
    borderRadius: moderateScale(15),
    marginBottom: hp(2),
    paddingHorizontal: wp(5),

    flexDirection: "row",
    alignItems: "center",

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },

  dropCircle: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: colors.mediumgreen,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(4),
  },

  taskTextBox: {
    flex: 1,
  },

  taskPlantName: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(24),
    color: colors.textDarkest,
    marginBottom: -hp(0.5),
  },

  taskType: {
    ...Typography.smallCardTitle,
    color: colors.mediumgreen,
    marginTop: hp(1),
  },
  taskText: {
    ...Typography.bodySmall,
    color: colors.textDarkest,
    marginBottom: hp(1.5),
  },
  checkCircle: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    borderWidth: 2,
    borderColor: colors.mediumgreen,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyBox: {
    marginTop: hp(4),
    alignItems: "center",
  },

  emptyText: {
    ...Typography.cardTitle,
    color: colors.mediumgreen,
    textAlign: "center",
  },
});
